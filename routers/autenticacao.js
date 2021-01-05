const AutenticacaoController = require('../controllers/AutenticacaoController')
const passport = require('passport')
const middlewaresAutenticacao = require('../config/middlewaresAutenticacao')

module.exports = app => {
    app.post('/autenticacao/login',middlewaresAutenticacao.local,(req,res) => {
        AutenticacaoController.login(req,res)
    })
}
