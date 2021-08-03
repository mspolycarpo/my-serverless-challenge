const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const enviroment = require("../common/enviroment");
const dynamoDb = require("../clients/dynamoDbClient");
const app = express();

app.use(express.json());

app.get("/healthCheck", (req, res) => {
  res.send({ versao: "1.0.0", mensagem: "Estou UP!" });
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
