const imovelDao = require('../dao/imovelDao')
const caixaDao = require("../dao/caixaDao");
const clienteDao = require("../dao/clienteDao");
const limparDados = require("../functions/limparDados");

class ImovelController {
    async cadastrar(req, res) {
        let { imovel, idUsuario } = req.body
        await imovelDao.cadastrar(imovel, idUsuario).then(response => {
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

    async visualizarTodosNovoPadrao(req, res) {
        let {pagina, itensPorPagina, filtro} = req.query

        try{
            let imoveis = await imovelDao.visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro)
            let total = await imovelDao.contarImoveis(filtro)

            return res.status(200).json({falha: false, dados: {total, imoveis}})
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async visualizarNovoPadrao(req, res){
        let { idImovel } = req.query

        try{
            // let imovel = await imovelDao.visualizar(idImovel).then(resultado => resultado)

            let imovel = await imovelDao.visualizarNovoPadrao(idImovel).then(resultado => resultado)

            return res.status(200).json({ falha: false, dados: {imovel } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }

    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await imovelDao.visualizarBusca(busca).then(consulta => {
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
        }).catch(erro => {
            if(erro.code == "23503"){
                res.status('500').json({erro:"Esse imóvel está vinculado a um contrato"})
            }
        })


    }

    async visualizar(req,res) {
        const { id } = req.params
        await imovelDao.visualizar(id).then(resultado => {
            res.status(200).json(resultado)
        })
    }

    async editarImovel(req, res){
        const id = req.params.id
        let { imovel, idUsuario } = req.body
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
        let { comodo, idImovel, idUsuario } = req.body

        if(isNaN(parseInt(comodo.quantidade)))
            comodo.quantidade = 0
        else
            comodo.quantidade = parseInt(comodo.quantidade)

        let comodoFormatado = limparDados(comodo);

        await imovelDao.cadastrarComodo(idImovel, comodoFormatado, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editarComodo(req, res){
        let { comodo, idUsuario } = req.body

        let comodoFormatado = limparDados(comodo);

        await imovelDao.editarComodo(comodoFormatado, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarComodo(req,res){
        let idComodo = req.query.idComodo
        await imovelDao.deletarComodo(idComodo).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarComodoNovoPadrao(req, res) {
        let  { idComodo, idUsuario } = req.query

        try {
            let resp = await imovelDao.deletarComodoNovoPadrao(idComodo, idUsuario)

            return res.status(200).json(resp)
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
        // await imovelDao.deletarComodoNovoPadrao(idComodo).then(response => {
        //     res.status(200).json(response)
        // })
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
