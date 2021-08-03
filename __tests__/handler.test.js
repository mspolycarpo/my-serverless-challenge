const handler = require("../handler");
const supertest = require("supertest");

const address = "http//localhost:3000/dev";
const basePath = "/funcionarios";

test("Verificando se app esta UP", async () => {
  const res = await supertest(handler.app).get("/healthCheck");
  expect(res.status).toBe(200);
});
