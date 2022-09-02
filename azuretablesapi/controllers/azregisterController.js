const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const bcrypt = require('bcrypt');

// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_USERS, credential);

function containsSpecialChars(str) {
    const specialChars = /[/\s/`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}


const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    else {
        try {
            // check for duplicate usernames in the db
            const duplicate = await tableClient.getEntity("users", req.body.user);
            if (duplicate) return res.sendStatus(409); //Conflict 

        } catch (err) {

            if (containsSpecialChars(user)) {

                res.status(403).json({ 'message': 'username cannot contain special charecters' });

            } else {

                //encrypt the password
                const hashedPwd = await bcrypt.hash(pwd, 10);
                console.log(hashedPwd);
                //create and store the new user
                // const result = await User.create({
                //     "username": user,
                //     "password": hashedPwd
                // });

                payload = {
                    "partitionKey": "users", // harcoded
                    "rowKey": user,
                    "pwd": hashedPwd,
                    "status": true
                }

                let result = await tableClient.createEntity(payload);
                res.status(201).json({ 'success': `New user ${user} created!` });

            }


        }

    }
}

module.exports = { handleNewUser };