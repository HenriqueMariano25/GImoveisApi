const ImovelController = require('../controllers/ImovelController')
const CaixaController = require("../controllers/CaixaController");

module.exports = app => {
    app.post('/imovel/cadastrar', (req, res) => {
        ImovelController.cadastrar(req,res)
    })
    app.get('/imoveis', (req,res) => {
        ImovelController.visualizarTodos(res)
    })

    app.get("/imoveis/novo_padrao", ImovelController.visualizarTodosNovoPadrao)

    app.get("/imovel/novo_padrao", ImovelController.visualizarNovoPadrao)

    app.get("/imoveis/busca", ImovelController.visualizarBusca)

    app.get('/imoveis/simples', (req,res) => {
        ImovelController.visualizarSimples(res)
    })
    app.get('/imovel/tipos_imoveis', (req, res) => {
        ImovelController.tiposImoveis(res)
    })
    app.get('/imovel/status', (req, res) => {
        ImovelController.status(res)
    })
    app.get('/imovel/:id', (req,res) => {
        ImovelController.visualizar(req,res)
    })
    app.delete('/imovel/deletar/:id', (req,res) => {
        ImovelController.deletarImovel(req,res)
    })

    app.post('/imovel/editar/:id', (req,res) => {
        ImovelController.editarImovel(req,res)
    })
    app.get('/imoveis/tipo_comodo', (req, res) => {
        ImovelController.tiposComodos(res)
    })
    app.get('/imoveis/comodos', (req, res) => {
        ImovelController.comodos(req,res)
    })
    app.post('/imoveis/comodo/cadastrar', (req, res) =>{
        ImovelController.cadastrarComodo(req, res)
    })
    app.post('/imoveis/comodo/editar', (req, res) => {
        ImovelController.editarComodo(req, res)
    })
    app.delete('/imoveis/comodo/deletar', (req,res) => {
        ImovelController.deletarComodo(req,res)
    })
    app.delete("/imoveis/comodo/deletar/novo_padrao", ImovelController.deletarComodoNovoPadrao)

    app.get('/imoveis/contratos', (req,res) => {
        ImovelController.contratos(req,res)
    })
    app.get('/imoveis/despesas/tipo_despesas', (req, res) => {
        ImovelController.tiposDespesas(req, res)
    })
    app.post('/imoveis/despesas/cadastrar', (req,res) => {
        ImovelController.cadastrarDespesa(req, res)
    })
    app.get('/imoveis/despesas', (req, res) => {
        ImovelController.despesas(req,res)
    })
    app.post('/imoveis/despesas/editar', (req, res) => {
        ImovelController.editarDespesa(req,res)
    })
    app.delete('/imoveis/despesa/:id/deletar', (req, res) => {
        ImovelController.deletarDespesa(req, res)
    })
    app.get('/imoveis/proprietarios', (req, res) => {
        ImovelController.proprietarios(res)
    })
    app.get('/imoveis/despesas/responsavel_pagamento', (req, res) => {
        ImovelController.responsaveisPagameneto(res)
    })
}
