const ClienteController = require('../controllers/ClienteController')
const CaixaController = require("../controllers/CaixaController");

module.exports = app => {
    app.get('/clientes',(req,res) => {
        ClienteController.visualizarTodos(res)
    })
    app.get('/clientes/novo_padrao',ClienteController.visualizarTodosNovoPadrao)


    app.get('/cliente',(req,res) => {
        ClienteController.visualizar(req,res)
    })
    app.get("/cliente/busca", ClienteController.visualizarBusca)

    app.post('/cliente/cadastrar',(req, res) => {
        ClienteController.cadastrar(req,res)
    })
    app.post('/cliente/editar/:id',(req, res) => {
        ClienteController.editar(req,res)
    })
    app.delete('/cliente/deletar/:id',(req, res) => {
        ClienteController.deletar(req,res)
    })

    app.delete("/cliente/deletar/:id/novo_padrao", ClienteController.deletarNovoPadrao)

    app.get('/cliente/consultar_cep/:cep', (req, res) => {
        ClienteController.consultarCep(req,res)
    })
    app.get('/cliente/tipos_status', (req, res) => {
        ClienteController.tipoStatus(res)
    })
    app.get('/cliente/contratos', (req,res) => {
        ClienteController.contratos(req,res)
    })
    app.get('/cliente/contrato/boletos', (req,res) => {
        ClienteController.boletos(req, res)
    })
    app.post('/cliente/telefone/cadastrar', (req, res) => {
        ClienteController.cadastrarTelefone(req,res)
    })
    app.post('/cliente/telefone/editar', (req, res) => {
        ClienteController.editarTelefone(req, res)
    })
    app.delete('/cliente/telefone/deletar', (req, res) => {
        ClienteController.deletarTelefone(req,res)
    })

    app.delete('/cliente/telefone/deletar/novo_padrao',ClienteController.deletarTelefoneNovoPadrao)

    app.post("/cliente/cadastrar/novo_padrao", ClienteController.cadastrarNovoPadrao)
}
