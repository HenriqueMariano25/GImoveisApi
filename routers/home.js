const HomeController = require('../controllers/HomeController')

module.exports = app => {
    app.get('/home/contratos_vencendo', (req, res) => {
        HomeController.contratosVencendo(res)
    })
}