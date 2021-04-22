const ContratoController = require('../controllers/ContratoController')
const multer = require('multer')
const multerConfig = require('../config/multer')

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
    app.get('/contrato/status', (req, res) => {
        ContratoController.status(res)
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
    app.get('/contrato/id_fiador', (req, res) => {
        ContratoController.idFiador(res)
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
    app.post('/contrato/boleto/cadastrar', (req, res) => {
        ContratoController.cadastrarBoleto(req, res)
    })
    app.delete('/contrato/boleto/deletar', (req, res) => {
        ContratoController.deletarBoleto(req, res)
    })
    // app.post('/contrato/:id/importar/pdf', upload.single('files'),(req,res) => {
    //     ContratoController.importarPDF(req,res)
    // })
    app.post('/contrato/:id/importar/pdf', multer(multerConfig).single('files'),(req,res) => {
        ContratoController.importarPDF(req,res)
    })
    app.post('/contrato/fiador/cadastrar',(req, res) => {
        ContratoController.cadastrarFiador(req, res)
    })
    app.get('/contrato/fiadores', (req, res) => {
        ContratoController.fiadores(req,res)
    })
    app.post('/contrato/fiador/editar', (req, res) => {
        ContratoController.editarFiador(req, res)
    })
    app.delete('/contrato/fiador/deletar', (req, res) => {
        ContratoController.deletarFiador(req, res)
    })
    app.patch('/contrato/reajuste', (req, res) => {
        ContratoController.aplicarReajuste(req, res)
    })
    app.get('/contrato/reajuste', (req, res) => {
        ContratoController.contratosParaReajustar(req, res)
    })
}
