const RelatorioController = require("../controllers/RelatorioController");

module.exports = app => {
    app.get("/relatorio/alugueis_pendentes", RelatorioController.relatorioAlugueisPendentes)
}