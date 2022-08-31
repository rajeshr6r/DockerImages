const { TableServiceClient, TableClient } = require("@azure/data-tables");

const tableService = TableServiceClient.fromConnectionString(process.env.AZURE_TBL_CONNECTIONSTRING);
const tableClient = TableClient.fromConnectionString(process.env.AZURE_TBL_CONNECTIONSTRING, tableService)
console.log(tableClient);


const getSubscribersbyCountry = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Country ID required.' });

    const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq ${req.params.id}` }
    });

    // List all the entities in the table    
    for await (const entity of entities) {
        console.log(entity);
    }

    if (!entities) {
        return res.status(204).json({ "message": `No data for Country ID ${req.params.id}.` });
    }
    res.json(entities);
}


module.exports = {
    getSubscribersbyCountry
}