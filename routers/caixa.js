const CaixaController = require('../controllers/CaixaController')

module.exports = app => {
    app.post('/caixa', (req, res) => {
        CaixaController.cadastrar(req, res)
    })
    app.get('/caixa', (req, res) => {
        CaixaController.visualizarTodos(req, res)
    })
    app.put('/caixa', (req, res) => {
        CaixaController.editar(req, res)
    })
    app.delete('/caixa/:id', (req, res) => {
        CaixaController.deletar(req, res)
    })
    app.get("/caixa/relatorio", CaixaController.buscarRelatorio)

    app.get("/caixa/busca", CaixaController.visualizarBusca)
}