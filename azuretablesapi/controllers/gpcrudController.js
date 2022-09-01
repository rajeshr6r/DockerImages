const { odata, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");


// Use AzureNamedKeyCredential with storage account and account key
// AzureNamedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new AzureNamedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);

// const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.TBL_CONTACT, credential);

const fetchDatalevel1 = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req?.body?.tablename || !req?.body?.partitionKey) {
            res.status(400).json({ 'message': 'Insufficient or Incorrect payload' });
        } else {

            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, req.body.tablename, credential);

            const entities = tableClient.listEntities({
                queryOptions: { filter: odata`PartitionKey eq ${req.body.partitionKey}` }
            });

            // List all the entities in the table    
            var data = []
            for await (const entity of entities) {
                //console.log(entity);
                data.push(entity);
            }

            if (data.length === 0) {
                return res.status(404).json({ "message": "No Data for the parameters" });
            }
            else {
                res.status(200).json({ "countofrecords": data.length, "data": data });
            }
        }


    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}

const fetchDatalevel2 = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req?.body?.tablename || !req?.body?.partitionKey || !req?.body?.rowKey) {
            res.status(400).json({ 'message': 'Insufficient or Incorrect payload' });
        } else {

            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, req.body.tablename, credential);

            const entities = tableClient.listEntities({
                queryOptions: { filter: odata`PartitionKey eq ${req.body.partitionKey} and RowKey eq ${req.body.rowKey}` }
            });

            // List all the entities in the table    
            var data = []
            for await (const entity of entities) {
                //console.log(entity);
                data.push(entity);
            }

            if (data.length === 0) {
                return res.status(404).json({ "message": "No Data for the parameters" });
            }
            else {
                res.status(200).json({ "countofrecords": data.length, "data": data });
            }
        }


    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}


const insertData = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req?.body?.tablename || !req?.body?.partitionKey || !req?.body?.rowKey) {
            res.status(400).json({ 'message': 'Insufficient or Incorrect payload' });
        } else {
            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, req.body.tablename, credential);

            let result = await tableClient.createEntity(req.body);

            if (!result) {
                return res.sendStatus(400); // something wrong
            }
            else {
                res.sendStatus(201);// all well
            }
        }


    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}

const updateData = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req?.body?.tablename || !req?.body?.partitionKey || !req?.body?.rowKey) {
            res.status(400).json({ 'message': 'Insufficient or Incorrect payload' });
        } else {
            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, req.body.tablename, credential);

            //let result = await tableClient.upsertEntity(req.body, "Replace");
            let result = await tableClient.upsertEntity(req.body, "Merge");

            if (!result) {
                return res.send(400); // something wrong
            }
            else {
                res.send(201);// all well
            }
        }


    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}

const deleteData = async (req, res) => {
    try {
        //console.log(req.body);
        if (!req?.body?.tablename || !req?.body?.partitionKey || !req?.body?.rowKey) {
            res.status(400).json({ 'message': 'Insufficient or Incorrect payload' });
        } else {
            const tableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, req.body.tablename, credential);

            //let result = await tableClient.upsertEntity(req.body, "Replace");
            let result = await tableClient.deleteEntity(req.body.partitionKey, req.body.rowKey);

            if (!result) {
                return res.send(400); // something wrong
            }
            else {
                res.send(201);// all well
            }
        }


    } catch (error) {

        return res.status(500).json({ "error": `${error}.` });

    }

}




module.exports = {
    fetchDatalevel1,
    fetchDatalevel2,
    insertData,
    updateData,
    deleteData,

}