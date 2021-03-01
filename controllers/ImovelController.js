const imovelDao = require('../dao/imovelDao')

class ImovelController {
    async cadastrar(req, res) {
        const dadosImovel = req.body.data
        let comodos = req.body.comodos
        await imovelDao.cadastrar(dadosImovel).then(response => {
            let idImovel = response[0].id
            for (let index in comodos) {
                if (comodos[index].quantidade != 0 && comodos[index].tipo != null) {
                    let quantidadeComodo = comodos[index].quantidade
                    let tipoComodo = comodos[index].tipo
                    imovelDao.cadastrarComodo(idImovel, quantidadeComodo, tipoComodo).then(response => {
                    })
                }
            }
            res.status(200).json(response)
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
        const id = req.params.id
        const imovel = req.body.data
        const comodos = req.body.comodos
        await imovelDao.editarImovel(id, imovel).then(response => {
            for (let index in comodos) {
                let quantidadeComodo = comodos[index].quantidade
                let tipoComodo = comodos[index].tipo
                let idComodo = comodos[index].id
                if (comodos[index].quantidade != 0 && comodos[index].tipo != null) {
                    if (idComodo == null) {
                        imovelDao.cadastrarComodo(id, quantidadeComodo, tipoComodo)
                    } else {
                        imovelDao.editarComodo(comodos[index])
                    }
                }
            }
            res.status(200).json(response)
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

    async deletarComodo(req,res){
        let idComodo = req.body.idComodo
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
        console.log(despesa)
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
        console.log(despesa)
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
