const ClienteController = require('../controllers/ClienteController')

module.exports = app => {
    app.get('/clientes',(req,res) => {
        ClienteController.visualizarTodos(res)
    })
    app.get('/cliente',(req,res) => {
        ClienteController.visualizar(req,res)
    })
    app.post('/cliente/cadastrar',(req, res) => {
        ClienteController.cadastrar(req,res)
    })
    app.post('/cliente/editar/:id',(req, res) => {
        ClienteController.editar(req,res)
    })
}
