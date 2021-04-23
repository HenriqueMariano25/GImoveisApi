const BoletoController = require('../controllers/BoletoController')

module.exports = app => {
    app.get('/boletos/vencendo', (req, res) => {
        BoletoController.boletosVencendo(res)
    })
}