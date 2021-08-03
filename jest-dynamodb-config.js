const enviroment = require("./src/common/enviroment");

module.exports = {
  tables: [
    {
      TableName: "funcionarios-table-test",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    // etc
  ],
  port: enviroment.localDb.port,
};
