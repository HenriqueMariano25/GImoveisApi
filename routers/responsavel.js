const ResponsavelController = require('../controllers/ResponsavelController')

module.exports = app => {
    app.post('/responsavel/cadastrar', (req, res) => {
        ResponsavelController.cadastrar(req, res)
    })
    app.get('/responsaveis', (req,res) => {
        ResponsavelController.visualizarTodos(res)
    })
    app.get('/responsavel/:id', (req,res) => {
        ResponsavelController.visualizar(req,res)
    })
    app.post('/responsavel/editar/:id', (req,res) => {
        ResponsavelController.editar(req,res)
    })
    app.delete('/responsavel/deletar/:id',(req,res) => {
        ResponsavelController.deletar(req,res)
    })
}