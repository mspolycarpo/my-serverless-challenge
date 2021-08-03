const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const enviroment = require("./common/enviroment");

const app = express();

const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;

if (IS_OFFLINE === true || ["test"].includes(process.env.NODE_ENV)) {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: enviroment.localDb.region,
    endpoint: enviroment.localDb.url,
    sslEnabled: false,
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(express.json());

app.get("/healthCheck", (req, res) => {
  res.send({ versao: "1.0.0", mensagem: "Estou UP!", online: !IS_OFFLINE });
});

app.get("/funcionarios", async (req, res) => {
  const params = {
    TableName: enviroment.TABELA_FUNCIONARIOS,
  };

  try {
    const { Items } = await dynamoDb.scan(params).promise();
    res.send(Items);
  } catch (e) {
    console.log(e);
    res.status(500).send({ body: e.message });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Não encontrado :-(",
  });
});

module.exports.handler = serverless(app);
module.exports.app = app;
