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

//#region Criação de funcionário

test("Criar funcionario - Caminho feliz :-)", async () => {
  try {
    const res = await request.post("/funcionarios").send({
      nome: "Matheus",
      id: Math.floor(1000 * Math.random()),
      cargo: "Administrador",
      idade: 26,
    });
    expect(res.status).toBe(201);
  } catch (e) {
    throw Error(e);
  }
});

test("Criar funcionario - ID ja existente", async () => {
  try {
    const id = Math.floor(1000 * Math.random());
    const res = await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    expect(res.status).toBe(201);

    const res1 = await request.post("/funcionarios").send({
      nome: "Joao",
      id,
      cargo: "Administrador",
      idade: 26,
    });
    expect(res1.status).toBe(400);
    expect(res1.body.mensagem).toBe(" id já existe");
  } catch (e) {
    throw Error(e);
  }
});

test("Criar funcionario - Sem chave id,nome,cargo ou idade ", async () => {
  try {
    const id = Math.floor(1000 * Math.random());
    const semId = {
      nome: "Matheus",
      cargo: "Administrador",
      idade: 26,
    };
    const semNome = {
      id,
      cargo: "Administrador",
      idade: 26,
    };
    const semCargo = {
      nome: "Matheus",
      id,
      idade: 26,
    };
    const semIdade = {
      nome: "Matheus",
      id: 1,
      cargo: "Administrador",
    };
    const res = await request.post("/funcionarios").send(semId);
    const res1 = await request.post("/funcionarios").send(semNome);
    const res2 = await request.post("/funcionarios").send(semCargo);
    const res3 = await request.post("/funcionarios").send(semIdade);

    expect(res.status).toBe(400);
    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
    expect(res3.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});

test("Criar funcionario - ID precisa ser inteiro", async () => {
  try {
    const res = await request.post("/funcionarios").send({
      nome: "Matheus",
      id: 10.5,
      cargo: "Administrador",
      idade: 26,
    });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toBe("id precisa ser inteiro");
  } catch (e) {
    throw Error(e);
  }
});

//#endregion

//#region Busca funcionario por ID
test("Busca funcionario por ID", async () => {
  try {
    const id = Math.floor(1000 * Math.random());
    await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    const res = await request.get(`/funcionarios/${id}`);
    expect(res.status).toBe(200);
  } catch (e) {
    throw Error(e);
  }
});

test("Busca funcionario por ID - Não encontra item", async () => {
  try {
    const id = 2;
    await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    const res = await request.get("/funcionarios/8");
    expect(res.status).toBe(204);
  } catch (e) {
    throw Error(e);
  }
});

test("Busca funcionario por ID - ID não inteiro ", async () => {
  try {
    const id = 2;
    await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    const res = await request.get("/funcionarios/A");
    expect(res.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});

//#endregion

//#region Atualização de funcionario
test("Atualizar funcionario - Caminho feliz :-)", async () => {
  try {
    const id = Math.floor(1000 * Math.random());
    const res = await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    expect(res.status).toBe(201);

    const res1 = await request.put(`/funcionarios/${id}`).send({
      nome: "Joao",
      cargo: "Administrador",
      idade: 26,
    });
    expect(res1.status).toBe(200);
  } catch (e) {
    throw Error(e);
  }
});

test("Atualizar funcionario - id não existe", async () => {
  try {
    const res = await request.put(`/funcionarios/1`).send({
      nome: "Matheus",
      cargo: "Administrador",
      idade: 26,
    });
    expect(res.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});

test("Atualizar funcionario - id não inteiro", async () => {
  try {
    const res = await request.put(`/funcionarios/A`).send({
      nome: "Matheus",
      cargo: "Administrador",
      idade: 26,
    });
    expect(res.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});

//#endregion

//#region Deletar funcionario
test("Deletar funcionario - Caminho feliz :-)", async () => {
  try {
    const id = Math.floor(1000 * Math.random());
    const res = await request.post("/funcionarios").send({
      nome: "Matheus",
      id,
      cargo: "Administrador",
      idade: 26,
    });

    expect(res.status).toBe(201);

    const res1 = await request.delete(`/funcionarios/${id}`);
    expect(res1.status).toBe(200);
  } catch (e) {
    throw Error(e);
  }
});

test("Deletar funcionario - Id não existe", async () => {
  try {
    const res1 = await request.delete(`/funcionarios/1`);
    expect(res1.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});

test("Deletar funcionario  - id não inteiro", async () => {
  try {
    const res = await request.delete(`/funcionarios/A`);
    expect(res.status).toBe(400);
  } catch (e) {
    throw Error(e);
  }
});
