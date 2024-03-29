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

    app.get('/ajuste/historico', (req, res) => {
        AjusteController.visualizarTodosHistoricos(req,res)
    })
    app.post('/ajuste/historico', (req, res) => {
        AjusteController.cadastrarHistorico(req, res)
    })

    app.put('/ajuste/historico', (req, res) => {
        AjusteController.editarHistorico(req, res)
    })

    app.delete('/ajuste/historico/:id', (req, res) => {
        AjusteController.deletarHistorico(req, res)
    })
}