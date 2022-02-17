const ajusteDao = require('../dao/ajusteDao')

class AjusteController {
    async cadastrarConta(req, res) {
        let { conta, idUsuario } = req.body
        await ajusteDao.cadastrarConta(conta, idUsuario).then(resp => {
            res.status(200).json(resp)
        })
    }

    async visualizarTodasContas(req, res){
        await ajusteDao.visualizarTodasContas().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editarConta(req, res){
        let { conta, idUsuario } = req.body
        await ajusteDao.editarConta(conta, idUsuario).then(resp => {
            res.status(200).json(resp)
        })
    }

    async visualizarTodosHistoricos(req, res){
        await ajusteDao.visualizarTodosHistoricos().then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async cadastrarHistorico(req, res) {
        let { historico } = req.body
        await ajusteDao.cadastrarHistorico(historico).then(resp => {
            res.status(200).json(resp)
        })
    }

    async editarHistorico(req, res) {
        let { historico } = req.body

        await ajusteDao.editarHistorico(historico).then(resp => {
            res.status(200).json(resp)
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