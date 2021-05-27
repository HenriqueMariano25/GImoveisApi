const CaixaController = require('../controllers/CaixaController')

module.exports = app => {
    app.post('/caixa', (req, res) => {
        CaixaController.cadastrar(req, res)
    })
    app.get('/caixa', (req, res) => {
        CaixaController.visualizarTodos(res)
    })
}