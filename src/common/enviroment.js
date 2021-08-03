module.exports = {
  TABELA_FUNCIONARIOS:
    process.env.TABELA_FUNCIONARIOS || "funcionarios-table-test",
  localDb: { region: "localhost", port: 8000, url: "http://localhost:8000" },
};
