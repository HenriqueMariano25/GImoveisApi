const ContratoController = require('../controllers/ContratoController')
const multer = require('multer')
const multerConfig = require('../config/multer')
const CaixaController = require("../controllers/CaixaController");

module.exports = app => {
    app.get("/contratos", ContratoController.visualizarTodos)

    app.get("/contratos/novo_padrao", ContratoController.visualizarTodosNovoPadrao)

    app.get('/contrato', (req,res) => {
        ContratoController.visualizar(req,res)
    })
    app.post('/contrato/cadastrar', (req,res) => {
        ContratoController.cadastrar(req,res)
    })

    app.post("/contrato/cadastrar/novo_padrao", ContratoController.cadastrarNovoPadrao)

    app.post('/contrato/editar', (req,res) => {
        ContratoController.editar(req,res)
    })
    app.delete('/contrato/deletar/:id', (req,res) => {
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

    app.post('/contrato/boleto/editar_novo_padrao', (req, res) => {
        ContratoController.editarBoletoNovoPadrao(req, res)
    })

    app.post('/contrato/boleto/cadastrar', (req, res) => {
        ContratoController.cadastrarBoleto(req, res)
    })
    app.delete('/contrato/boleto/deletar', (req, res) => {
        ContratoController.deletarBoleto(req, res)
    })
    app.post('/contrato/:id/importar/pdf', multer(multerConfig).single('files'),(req,res) => {
        ContratoController.importarPDF(req,res)
    })
    app.delete('/contrato/:id/remover/pdf', (req, res) => {
        ContratoController.deletarPDF(req, res)
    })
    app.delete('/contrato/:id/remover/aditivo', (req, res) => {
        ContratoController.deletarAditivo(req, res)
    })
    app.post('/contrato/:id/importar/aditivo', multer(multerConfig).single('files'),(req,res) => {
        ContratoController.importarAditivo(req,res)
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

    app.patch("/contrato/reverter_reajuste", ContratoController.reverterReajuste)

    app.get("/contrato/busca", ContratoController.visualizarBusca)

}
