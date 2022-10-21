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

    async buscarRelatorio(req, res){

        let {data_inicio, data_fim } = req.query

        console.log(data_inicio)
        console.log(data_fim)

        await caixaDao.buscarRelatorio(data_inicio, data_fim).then(resp => {
            console.log(resp)
            res.status(200).json(resp)
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await caixaDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}

module.exports = new CaixaController()