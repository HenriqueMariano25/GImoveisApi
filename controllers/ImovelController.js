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
        await imovelDao.visualizarTodos().then(response => {
            res.status(200).json(response)
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
        console.log('EDITANDO IMOVEL')
        const id = req.params.id
        console.log('Id: '+id)
        const imovel = req.body.data
        console.log(imovel)
        const idUsuario = req.body.idUsuario
        console.log('id_usuario: '+idUsuario)
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
        await imovelDao.cadastrarComodo(idImovel, comodo).then(response => {
            res.status(200).json(response)
        })
    }

    async editarComodo(req, res){
        let comodo = req.body.comodo
        await imovelDao.editarComodo(comodo).then(response => {
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
        await imovelDao.cadastrarDespesa(despesa, idImovel).then(response => {
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
        await imovelDao.editarDespesa(despesa).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarDespesa(req, res){
        let idDespesa = req.params.id
        await imovelDao.deletarDespesa(idDespesa).then(response => {
            res.status(200).json(response)
        })
    }
}

module.exports = new ImovelController
