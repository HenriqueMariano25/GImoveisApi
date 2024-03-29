const ResponsavelController = require('../controllers/ResponsavelController')
const CaixaController = require("../controllers/CaixaController");

module.exports = app => {
    app.post('/responsavel/cadastrar', (req, res) => {
        ResponsavelController.cadastrar(req, res)
    })

    app.post("/responsavel/cadastrar/novo_padrao", ResponsavelController.cadastrarNovoPadrao)

    app.get('/responsaveis', (req,res) => {
        ResponsavelController.visualizarTodos(res)
    })

    app.get("/responsaveis/novo_padrao", ResponsavelController.visualizarTodosNovoPadrao)

    app.get("/responsaveis/busca", ResponsavelController.visualizarBusca)


    app.get('/responsavel/:id', (req,res) => {
        ResponsavelController.visualizar(req,res)
    })

    app.post("/responsavel/editar/novo_padrao", ResponsavelController.editarNovoPadrao)

    app.post('/responsavel/editar/:id', (req,res) => {
        ResponsavelController.editar(req,res)
    })

    app.delete("/responsavel/deletar/novo_padrao", ResponsavelController.deletarNovoPadrao)

    app.delete('/responsavel/deletar/:id',(req,res) => {
        ResponsavelController.deletar(req,res)
    })
}