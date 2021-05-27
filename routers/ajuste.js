const AjusteController = require('../controllers/AjusteController')

module.exports = app => {
    app.post('/ajuste/conta', (req, res) => {
        AjusteController.cadastrarConta(req, res)
    })
    app.get('/ajuste/conta', (req, res) => {
        AjusteController.visualizarTodasContas(req, res)
    })
    app.put('/ajuste/conta', (req, res) => {
        AjusteController.editarConta(req, res)
    })
}