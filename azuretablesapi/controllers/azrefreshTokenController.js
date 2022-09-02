const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const jwt = require('jsonwebtoken');
// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_USERS, credential);


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    //console.log(cookies);

    //working on this 
    //if (!cookies?.jwt) return res.sendStatus(401);
    //const refreshToken = cookies.jwt;

    const refreshToken = req.body.refreshToken;
    //console.log(refreshToken);


    const foundUser = tableClient.listEntities({
        queryOptions: { filter: odata`PartitionKey eq users and refreshToken eq ${refreshToken}` }
    });

    //console.log(foundUser);

    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            //const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        //"roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            //res.json({ roles, accessToken })
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }