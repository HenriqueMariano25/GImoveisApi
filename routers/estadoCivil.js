const EstadoCivilController = require('../controllers/EstadoCivilController')

module.exports = app => {
    app.get('/estados_civis',(req,res) => {
        EstadoCivilController.visualizarTodos(res)
    })
}
