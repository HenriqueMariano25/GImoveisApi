const CaixaController = require('../controllers/CaixaController')

module.exports = app => {
    app.post('/caixa', (req, res) => {
        CaixaController.cadastrar(req, res)
    })

    app.post("/caixa/novo_padrao", CaixaController.cadastrarNovoPadrao)

    app.get('/caixa', (req, res) => {
        CaixaController.visualizarTodos(req, res)
    })

    app.get("/caixa/novo_padrao", CaixaController.visualizarTodosNovoPadrao)
    app.get("/caixa/filtro_avancado", CaixaController.visualizarFiltroAvancado)

    app.get("/caixa/:id", CaixaController.visualizarCaixa)

    app.put('/caixa', (req, res) => {
        CaixaController.editar(req, res)
    })

    app.put("/caixa/novo_padrao", CaixaController.editarNovoPadrao)


    app.delete('/caixa/:id', (req, res) => {
        CaixaController.deletar(req, res)
    })

    app.delete("/caixa/:id/novo_padrao", CaixaController.deletarNovoPadrao)

    app.get("/caixa/relatorio", CaixaController.buscarRelatorio)

    app.get("/caixa/relatorio/novo_padrao", CaixaController.buscarRelatorioNovoPadrao)

    app.get("/caixa/busca", CaixaController.visualizarBusca)
}