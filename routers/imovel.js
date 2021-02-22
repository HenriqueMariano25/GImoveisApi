const ImovelController = require('../controllers/ImovelController')

module.exports = app => {
    app.post('/imovel/cadastrar', (req, res) => {
        ImovelController.cadastrar(req,res)
    })
    app.get('/imoveis', (req,res) => {
        ImovelController.visualizarTodos(res)
    })
    app.get('/imovel', (req,res) => {
        ImovelController.visualizar(req,res)
    })
    app.delete('/imovel/deletar/:id', (req,res) => {
        ImovelController.deletarImovel(req,res)
    })
    app.get('/imovel/status', (req, res) => {
        ImovelController.status(res)
    })
    app.get('/imovel/tipos_imoveis', (req, res) => {
        ImovelController.tiposImoveis(res)
    })
    app.post('/imovel/editar/:id', (req,res) => {
        ImovelController.editarImovel(req,res)
    })
    app.get('/imoveis/tipo_comodo', (req, res) => {
        ImovelController.tiposComodos(res)
    })
    app.post('/imoveis/deletar/comodo', (req,res) => {
        ImovelController.deletarComodo(req,res)
    })
}
