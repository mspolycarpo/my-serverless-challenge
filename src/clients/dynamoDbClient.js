const DocumentClient = require("aws-sdk/lib/dynamodb/document_client");
const enviroment = require("../common/enviroment");
const IS_OFFLINE = process.env.IS_OFFLINE;

module.exports =
  IS_OFFLINE === true || ["test"].includes(process.env.NODE_ENV)
    ? new DocumentClient({
        region: enviroment.localDb.region,
        endpoint: enviroment.localDb.url,
        sslEnabled: false,
      })
    : new DocumentClient();
