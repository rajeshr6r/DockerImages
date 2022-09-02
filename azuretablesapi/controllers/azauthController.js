const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_USERS, credential);

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        const foundUser = await tableClient.getEntity("users", req.body.user);
        //console.log(foundUser.pwd);
        if (foundUser) {
            // evaluate password 
            const match = await bcrypt.compare(pwd, foundUser.pwd);
            //console.log(match);
            if (match) {
                //const roles = Object.values(foundUser.roles).filter(Boolean);
                // create JWTs
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": foundUser.RowKey,
                            //"roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '60s' }
                );
                const refreshToken = jwt.sign(
                    { "username": foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );
                // Saving refreshToken with current user
                foundUser.refreshToken = refreshToken;
                console.log(foundUser)
                let result = await tableClient.upsertEntity(foundUser, "Merge");
                //const result = await foundUser.save();
                console.log(result);
                // console.log(roles);

                // Creates Secure Cookie with refresh token
                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                // Send authorization roles and access token to user
                //res.json({ roles, accessToken });
                res.json({ accessToken });

            } else {
                res.sendStatus(401);
            }
        }
        else {
            res.sendStatus(401);
        }
    } catch (error) {
        //res.sendStatus(204).json({ "message": "userid or password invalid" });
        console.log(error);
    }

}

module.exports = { handleLogin };