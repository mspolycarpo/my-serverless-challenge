const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const enviroment = require("../common/enviroment");
const dynamoDb = require("../clients/dynamoDbClient");
const { validaChaves } = require("../common/validators");
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
    res.status(500).send({ body: e.message });
  }
});

app.post("/funcionarios", async (req, res) => {
  try {
    const Item = {
      id: req.body.id,
      nome: req.body.nome,
      cargo: req.body.cargo,
      idade: req.body.idade,
    };

    validaChaves(Item);

    const params = {
      TableName: enviroment.TABELA_FUNCIONARIOS,
      Item,
      ConditionExpression: "attribute_not_exists(id)",
    };
    await dynamoDb.put(params).promise();
    res.status(201).send({ sucesso: true, Item });
  } catch (e) {
    if (e.code && e.code === "ConditionalCheckFailedException") {
      res
        .status(e.statusCode)
        .send({ sucesso: false, mensagem: " id já existe" });
    } else if (e.code && e.code === "ValidationException") {
      res
        .status(e.statusCode)
        .send({ sucesso: false, mensagem: "A chave id é necessário" });
    } else {
      res
        .status(e.statusCode || 500)
        .send({ sucesso: false, mensagem: e.message });
    }
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    erro: "Não encontrado :-(",
  });
});

module.exports.handler = serverless(app);
module.exports.app = app;
