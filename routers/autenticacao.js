const AutenticacaoController = require('../controllers/AutenticacaoController')
const passport = require('passport')
const middlewaresAutenticacao = require('../config/middlewaresAutenticacao')

module.exports = app => {
    app.post('/autenticacao/login/novo_padrao', middlewaresAutenticacao.local, (req, res) => {
        AutenticacaoController.loginNovoPadrao(req, res)
    })

    app.post('/autenticacao/login',middlewaresAutenticacao.local,(req,res) => {
        AutenticacaoController.login(req,res)
    })

    app.get("/autenticacao/buscar/usuario", AutenticacaoController.buscarUsuario)
}
