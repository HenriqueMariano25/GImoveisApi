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
    app.delete('/cliente/deletar/:id',(req, res) => {
        ClienteController.deletar(req,res)
    })
    app.get('/cliente/consultar_cep/:cep', (req, res) => {
        ClienteController.consultarCep(req,res)
    })
    app.get('/cliente/tipos_status', (req, res) => {
        ClienteController.tipoStatus(res)
    })
    app.post('/cliente/deletar/telefone', (req, res) => {
        ClienteController.deletarTelefone(req,res)
    })
}
