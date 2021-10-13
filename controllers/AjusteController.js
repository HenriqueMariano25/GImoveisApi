const ajusteDao = require('../dao/ajusteDao')

class AjusteController {
    async cadastrarConta(req, res) {
        let conta = req.body.conta
        let idUsuario = req.body.idUsuario
        await ajusteDao.cadastrarConta(conta, idUsuario).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async visualizarTodasContas(req, res){
        await ajusteDao.visualizarTodasContas().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editarConta(req, res){
        let conta = req.body.conta
        let idUsuario = req.body.idUsuario
        await ajusteDao.editarConta(conta, idUsuario).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async visualizarTodosHistoricos(req, res){
        await ajusteDao.visualizarTodosHistoricos().then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async cadastrarHistorico(req, res) {
        let historico = req.body.historico
        await ajusteDao.cadastrarHistorico(historico).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async editarHistorico(req, res) {
        let historico = req.body.historico

        await ajusteDao.editarHistorico(historico).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async deletarHistorico(req, res){
        let { id } = req.params

        await ajusteDao.deletarHistorico(id).then(resposta => {
            res.status(200).json(resposta)
        }).catch(() => {
            res.status(401).json({message: 'Histórico sendo utilizado no caixa'})
        })
    }
}

module.exports = new AjusteController()