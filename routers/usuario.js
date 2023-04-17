const UsuarioController = require('../controllers/UsuarioController')
const CaixaController = require("../controllers/CaixaController");

module.exports = app => {
    app.post('/usuario/cadastrar',(req, res) => {
        UsuarioController.cadastrar(req,res)
    })

    app.post("/usuario/cadastrar/novo_padrao", UsuarioController.cadastrarNovoPadrao)

    app.get("/usuarios/novo_padrao", UsuarioController.visualizarTodosNovoPadrao)

    app.get('/usuarios/', (req,res) => {
        UsuarioController.visualizarTodos(res)
    })

    app.get('/usuario/:id', (req,res) => {
        UsuarioController.visualizar(req,res)
    })
    app.post('/usuario/editar/:id', (req, res) => {
        UsuarioController.editar(req,res)
    })

    app.post("/usuario/edtiar/novo_padrao", UsuarioController.editarNovoPadrao

    )
    app.delete("/usuario/deletar/novo_padrao", UsuarioController.deletarNovoPadrao)

    app.delete('/usuario/deletar/:id', (req, res) => {
        UsuarioController.deletar(req,res)
    })

    app.get('/usuarios/tipos_permissao', (req, res) => {
        UsuarioController.tiposPermissao(res)
    })

    app.get("/usuarios/busca", UsuarioController.visualizarBusca)
}
