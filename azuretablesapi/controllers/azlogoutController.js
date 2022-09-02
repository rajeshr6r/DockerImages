const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const jwt = require('jsonwebtoken');
// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_USERS, credential);


const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    try {

        const cookies = req.cookies;

        //working on this
        // if (!cookies?.jwt) return res.sendStatus(204); //No content
        // const refreshToken = cookies.jwt;

        const refreshToken = req.body.refreshToken;


        // Is refreshToken in db?
        const foundUser = tableClient.listEntities({
            queryOptions: { filter: odata`PartitionKey eq ${process.env.TBL_USERS} and refreshToken eq ${refreshToken}` }
        });

        // List all the entities in the table    
        var data = []
        for await (const entity of foundUser) {
            //console.log(entity);
            data.push(entity);
        }
        console.log(data);

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // Delete refreshToken in db
        foundUser.refreshToken = '';
        let result = await tableClient.upsertEntity(foundUser, "Merge");
        //console.log(result);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);

    } catch (error) {
        res.status(500).json({ "error": error });
    }

}

module.exports = { handleLogout }