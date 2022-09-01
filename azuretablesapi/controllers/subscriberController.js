const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");


// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

const getSubscribersbyCountry = async (req, res) => {
    try {

        if (!req?.params?.countryid) {
            return res.status(400).json({ 'message': 'Country ID required.' });
        } else {

            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_CONTACT, credential);

            const entities = tableClient.listEntities({
                queryOptions: { filter: odata`PartitionKey eq ${req.params.countryid}` }
            });

            // List all the entities in the table    
            var data = []
            for await (const entity of entities) {
                //console.log(entity);
                data.push(entity);
            }

            if (!entities) {
                return res.status(204).json({ "message": `No data for Country ID ${req.params.id}.` });
            }
            else {
                res.status(200).json({ "countofrecords": data.length, "data": data });
            }
        }

    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}

const getSubscriber = async (req, res) => {
    try {

        if (!req?.params?.countryid || !req?.params?.phonenumber) { return res.status(400).json({ 'message': 'Country ID and PhoneNumber required.' }); }
        else {

            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_CONTACT, credential);

            const entities = tableClient.listEntities({
                queryOptions: { filter: odata`PartitionKey eq ${req.params.countryid} and RowKey eq ${req.params.phonenumber}` }
            });

            // List all the entities in the table    
            var data = []
            for await (const entity of entities) {
                //console.log(entity);
                data.push(entity);
            }

            if (data.length === 0) {
                return res.status(204).json({ "message": "No Data for the parameters" });
            }
            else {
                res.status(200).json({ "countofrecords": data.length, "data": data });
            }

        }
    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}




module.exports = {
    getSubscribersbyCountry,
    getSubscriber
}