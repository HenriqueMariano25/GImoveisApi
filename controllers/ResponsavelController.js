const responsavelDao = require('../dao/responsavelDao')

class ResponsavelController {
    async cadastrar(req, res) {
        let responsavel = req.body.responsavel
        await responsavelDao.cadastrar(responsavel).then(response => {
            res.status(200).json(response)
        })
    }
    async visualizarTodos(res){
        await responsavelDao.visualizarTodos().then(response => {
            res.status(200).json(response)
        })
    }
    async visualizar(req,res){
        let idResponsavel = req.query.idResponsavel
        await responsavelDao.visualizar(idResponsavel).then(response => {
            res.status(200).json(response)
        })
    }
    async editar(req,res){
        let responsavel = req.body.responsavel
        console.log(responsavel)
        await responsavelDao.editar(responsavel).then(response => {
            res.status(200).json(response)
        })
    }
    async deletar(req,res){
        let idResponsavel = req.params.id
        await responsavelDao.deletar(idResponsavel).then(response => {
            console.log(response)
            res.status(200).json(response)
        })
    }
}
module.exports = new ResponsavelController()