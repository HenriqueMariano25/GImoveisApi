const UsuarioController = require('../controllers/UsuarioController')

module.exports = app => {
    app.post('/usuario/cadastrar',(req, res) => {
        UsuarioController.cadastrar(req,res)
    })
    app.get('/usuarios/', (req,res) => {
        UsuarioController.visualizarTodos(res)
    })
    app.get('/usuario/:id', (req,res) => {
        UsuarioController.visualizar(req,res)
    })
    app.post('/usuario/editar/:id', (req, res) => {
        UsuarioController.editar(req,res)
    })
    app.delete('/usuario/deletar/:id', (req, res) => {
        UsuarioController.deletar(req,res)
    })


    app.get('/usuarios/tipos_permissao', (req, res) => {
        UsuarioController.tiposPermissao(res)
    })
}