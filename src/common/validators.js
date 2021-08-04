const validaChaves = (Item) => {
  const chaves = ["id", "cargo", "idade", "nome"];
  const chavesFaltantes = [];

  chaves.forEach((c) => {
    if (!Item[c]) {
      chavesFaltantes.push(c);
    }
  });

  let e;
  if (Item.id && !Number.isInteger(Item.id)) {
    e = new Error("id precisa ser inteiro");
    e.statusCode = 400;
    throw e;
  }
  if (chavesFaltantes.length > 0) {
    e = new Error(`É necessário possuir: ${chavesFaltantes}`);
    e.statusCode = 400;
    throw e;
  }
};

const validaId = (id) => {
  if (id && !Number.isInteger(id)) {
    e = new Error("id precisa ser inteiro");
    e.statusCode = 400;
    throw e;
  }
};

module.exports = { validaChaves, validaId };
