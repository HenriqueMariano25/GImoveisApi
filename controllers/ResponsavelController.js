const responsavelDao = require('../dao/responsavelDao')
const caixaDao = require("../dao/caixaDao");

class ResponsavelController {
    async cadastrar(req, res) {
        let responsavel = req.body.responsavel
        let idUsuario = req.body.idUsuario
        await responsavelDao.cadastrar(responsavel, idUsuario).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome ou CPF/CNPJ duplicado"})
            }
        })
    }
    async visualizarTodos(res){
        await responsavelDao.visualizarTodos().then(response => {
            res.status(200).json(response)
        })
    }
    async visualizar(req,res){
        const { id } = req.params
        await responsavelDao.visualizar(id).then(response => {
            res.status(200).json(response)
        })
    }
    async editar(req,res){
        let { responsavel, idUsuario } = req.body
        await responsavelDao.editar(responsavel, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }
    async deletar(req,res){
        let { id } = req.params
        await responsavelDao.deletar(id).then(response => {
            console.log(response)
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23503"){
                res.status('500').json({erro:"Esse responsável está vinculado a um imóvel"})
            }
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await responsavelDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}
module.exports = new ResponsavelController()
