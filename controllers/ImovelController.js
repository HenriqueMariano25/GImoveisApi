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
                        console.log(response)
                    })
                }
            }
            res.status(200).json(response)
            console.log(response)
        })
    }

    async visualizarTodos(res) {
        await imovelDao.visualizarTodos().then(response => {
            res.status(200).json(response)
        })
    }

    async deletarImovel(req, res) {
        console.log(req.params.id)
        const idImovel = req.params.id
        await imovelDao.deletarImovel(idImovel).then(response => {
            res.status(200).json(response)
        })
    }

    async visualizar(req,res) {
        const id = req.query.id
        await imovelDao.visualizar(id).then(resultado => {
            console.log(resultado)
            res.status(200).json(resultado)
        })
    }

    async editarImovel(req, res){
        const id = req.params.id
        const imovel = req.body.data
        const comodos = req.body.comodos
        await imovelDao.editarImovel(id, imovel).then(response => {
            console.log(response.data)
            for (let index in comodos) {
                let quantidadeComodo = comodos[index].quantidade
                let tipoComodo = comodos[index].tipo
                let idComodo = comodos[index].id
                if(idComodo == null){
                    imovelDao.cadastrarComodo(id, quantidadeComodo, tipoComodo)
                }else {
                    imovelDao.editarComodo(comodos[index])
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
}

module.exports = new ImovelController