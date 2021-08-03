const handler = require("../src/handlers/handler");
const supertest = require("supertest");

const request = supertest(handler.app);

test("Verificando se app esta UP", async () => {
  try {
    const res = await request.get("/healthCheck");
    expect(res.status).toBe(200);
  } catch (e) {
    throw Error(e);
  }
});

test("Listar funcionarios - Status 200", async () => {
  try {
    const res = await request.get("/funcionarios");
    expect(res.status).toBe(200);
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
});
