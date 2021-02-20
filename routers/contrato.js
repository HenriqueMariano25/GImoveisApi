const ContratoController = require('../controllers/ContratoController')
const upload = require('../config/multer')

module.exports = app => {
    app.get('/contratos',(req,res) => {
        ContratoController.visualizarTodos(res)
    })
    app.get('/contrato', (req,res) => {
        ContratoController.visualizar(req,res)
    })
    app.post('/contrato/cadastrar', (req,res) => {
        ContratoController.cadastrar(req,res)
    })
    app.post('/contrato/editar', (req,res) => {
        ContratoController.editar(req,res)
    })
    app.delete('/contrato/deletar', (req,res) => {
        ContratoController.deletar(req,res)
    })
    app.get('/contrato/responsaveis', (req, res) => {
        ContratoController.responsaveis(res)
    })
    app.get('/contrato/clientes', (req, res) => {
        ContratoController.clientes(res)
    })
    app.get('/contrato/imoveis', (req, res) => {
        ContratoController.imoveis(res)
    })
    app.get('/contrato/boletos', (req,res) => {
        ContratoController.boletos(req,res)
    })
    app.get('/contrato/boleto', (req,res) => {
        ContratoController.boleto(req,res)
    })
    app.get('/contrato/boleto/status', (req,res) => {
        ContratoController.statusBoleto(req,res)
    })
    app.post('/contrato/boleto/editar', (req, res) => {
        ContratoController.editarBoleto(req,res)
    })
    app.post('/contrato/:id/importar/pdf', upload.single('files'),(req,res) => {
        // console.log(req.body, req.file)
        ContratoController.importarPDF(req,res)
    })
}