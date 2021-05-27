const imovelDao = require('../dao/imovelDao')

class ImovelController {
    async cadastrar(req, res) {
        const dadosImovel = req.body.data
        let idUsuario = req.body.idUsuario
        await imovelDao.cadastrar(dadosImovel, idUsuario).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome do imóvel duplicado"})
            }
        })
    }

    async visualizarTodos(res) {
        await imovelDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })
    }


    async visualizarSimples(res){
        await imovelDao.visualizarSimples().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async deletarImovel(req, res) {
        const idImovel = req.params.id
        await imovelDao.deletarComodosImovel(idImovel)
        await imovelDao.deletarImovel(idImovel).then(response => {
            res.status(200).json(response)
        })
    }

    async visualizar(req,res) {
        const id = req.query.id
        await imovelDao.visualizar(id).then(resultado => {
            res.status(200).json(resultado)
        })
    }

    async editarImovel(req, res){
        const id = req.params.id
        const imovel = req.body.data
        const idUsuario = req.body.idUsuario
        await imovelDao.editarImovel(id, imovel, idUsuario).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome do imóvel duplicado"})
            }
        })
    }

    async status(res){
        await imovelDao.status().then(response => {
            res.status(200).json(response)
        })
    }

    async tiposImoveis(res){
        await imovelDao.tiposImoveis().then(response => {
            res.status(200).json(response)
        })
    }

    async tiposComodos(res){
        await imovelDao.tiposComodos().then(response => {
            res.status(200).json(response)
        })
    }

    async comodos(req, res){
        let idImovel = req.query.idImovel
        await imovelDao.comodos(idImovel).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async cadastrarComodo(req, res){
        let comodo = req.body.comodo
        let idImovel = req.body.idImovel
        let idUsuario = req.body.idUsuario
        await imovelDao.cadastrarComodo(idImovel, comodo, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editarComodo(req, res){
        let comodo = req.body.comodo
        let idUsuario = req.body.idUsuario
        await imovelDao.editarComodo(comodo, idUsuario).then(response => {
            res.status(200).json({mensagem: "ok"})
        })
    }

    async deletarComodo(req,res){
        let idComodo = req.query.idComodo
        await imovelDao.deletarComodo(idComodo).then(() => {
            res.status(200).json()
        })
    }

    async contratos(req,res){
        let idImovel = req.query.idContrato
        await imovelDao.contratos(idImovel).then(response => {
            res.status(200).json(response)
        })
    }

    async tiposDespesas(req,res){
        await imovelDao.tiposDespesas().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async cadastrarDespesa(req,res){
        let despesa = req.body.despesa
        let idImovel = req.body.idImovel
        let idUsuario = req.body.idUsuario
        await imovelDao.cadastrarDespesa(despesa, idImovel, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async despesas(req,res){
        let idImovel = req.query.idImovel
        await imovelDao.despesas(idImovel).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editarDespesa(req, res){
        let despesa = req.body.despesa
        let idUsuario = req.body.idUsuario
        await imovelDao.editarDespesa(despesa, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarDespesa(req, res){
        let idDespesa = req.params.id
        await imovelDao.deletarDespesa(idDespesa).then(response => {
            res.status(200).json(response)
        })
    }

    async proprietarios(res){
        await imovelDao.proprietarios().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async responsaveisPagameneto(res){
        await imovelDao.responsaveisPagameneto().then(consulta => {
            res.status(200).json(consulta)
        })
    }
}

module.exports = new ImovelController
