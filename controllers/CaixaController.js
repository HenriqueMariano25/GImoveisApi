const caixaDao = require('../dao/caixaDao')

class CaixaController {
    async cadastrar(req, res) {
        let caixa = req.body.caixa
        let idUsuario = req.body.idUsuario
        await caixaDao.cadastrar(caixa, idUsuario).then((resposta) => {
            res.status(200).json(resposta)
        })
    }

    async visualizarTodos(req, res){
        let { page, size } = req.query

        // console.log(page, size)

        await caixaDao.visualizarTodos(page, size).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editar(req, res){
        let caixa = req.body.caixa
        let idUsuario = req.body.idUsuario
        await caixaDao.editar(caixa, idUsuario).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async deletar(req, res){
        let idCaixa = req.params.id
        await caixaDao.deletar(idCaixa).then(resposta => {
            res.status(200).json(resposta)
        })
    }
}

module.exports = new CaixaController()