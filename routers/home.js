const HomeController = require('../controllers/HomeController')

module.exports = app => {
    app.get('/home/contratos_vencendo', (req, res) => {
        HomeController.contratosVencendo(res)
    })

    app.get("/home/graficos/todos_contratos", HomeController.graficosTodosContratos)
}