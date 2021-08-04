const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const enviroment = require("../common/enviroment");
const dynamoDb = require("../clients/dynamoDbClient");
const { validaChaves, validaId } = require("../common/validators");
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
    const { items } = await dynamoDb.scan(params).promise();
    res.send({ sucesso: true, items });
  } catch (e) {
    res.status(500).send({ sucesso: false, mensagem: e.message });
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

app.get("/funcionarios/:id", async (req, res) => {
  try {
    validaId(Number.parseInt(req.params.id));
    const id = Number.parseInt(req.params.id);

    const params = {
      TableName: enviroment.TABELA_FUNCIONARIOS,
      Key: { id },
    };

    const item = await dynamoDb.get(params).promise();
    const statusCode = Object.values(item).length > 0 ? 200 : 204;
    res.status(statusCode).send({ sucesso: true, item });
  } catch (e) {
    res.status(e.statusCode || 500).send({ body: e.message || e });
  }
});

app.put("/funcionarios/:id", async (req, res) => {
  try {
    validaId(Number.parseInt(req.params.id));
    const id = Number.parseInt(req.params.id);

    const Item = {
      id,
      nome: req.body.nome,
      cargo: req.body.cargo,
      idade: req.body.idade,
    };

    validaChaves(Item);

    const params = {
      TableName: enviroment.TABELA_FUNCIONARIOS,
      Item,
      ConditionExpression: "attribute_exists(id)",
    };

    await dynamoDb.put(params).promise();

    res.send({ sucesso: true, Item });
  } catch (e) {
    if (e.code && e.code === "ConditionalCheckFailedException") {
      res
        .status(e.statusCode)
        .send({ sucesso: false, mensagem: " id não existe" });
    } else {
      res.status(e.statusCode || 500).send({ body: e.message || e });
    }
  }
});

app.delete("/funcionarios/:id", async (req, res) => {
  try {
    validaId(Number.parseInt(req.params.id));
    const id = Number.parseInt(req.params.id);

    const params = {
      TableName: enviroment.TABELA_FUNCIONARIOS,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
    };

    await dynamoDb.delete(params).promise();

    res.send({ sucesso: true });
  } catch (e) {
    if (e.code && e.code === "ConditionalCheckFailedException") {
      res
        .status(e.statusCode)
        .send({ sucesso: false, mensagem: " id não existe" });
    } else {
      res.status(e.statusCode || 500).send({ body: e.message || e });
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
