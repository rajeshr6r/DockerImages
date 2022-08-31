const { TableServiceClient } = require("@azure/data-tables");

const connectAzureTblDB = async () => {
    try {
        const tableService = TableServiceClient.fromConnectionString(process.env.AZURE_TBL_CONNECTIONSTRING);
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectAzureTblDB