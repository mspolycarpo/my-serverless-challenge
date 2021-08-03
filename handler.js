const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const TABELA_FUNCIONARIOS = process.env.TABELA_FUNCIONARIOS;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
if (IS_OFFLINE === true) {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(express.json());

app.get("/healthCheck", (req, res) => {
  res.send({ versao: "1.0.0", mensagem: "Estou UP!" });
});

app.get("/funcionarios", async (req, res) => {
  const params = {
    TableName: TABELA_FUNCIONARIOS,
  };

  try {
    const { Items } = await dynamoDb.scan(params).promise();
    res.send(Items);
  } catch (e) {
    console.log();
    res.status(500).send({ body: e.message });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Não encontrado :-(",
  });
});

module.exports.handler = serverless(app);
