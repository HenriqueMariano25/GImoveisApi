const responsavelDao = require('../dao/responsavelDao')
const caixaDao = require("../dao/caixaDao");
const clienteDao = require("../dao/clienteDao");
const usuarioDao = require("../dao/usuarioDao");
const limparDados = require("../functions/limparDados");

class ResponsavelController {
    async cadastrar(req, res) {
        let responsavel = req.body.responsavel
        let idUsuario = req.body.idUsuario
        await responsavelDao.cadastrar(responsavel, idUsuario).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome ou CPF/CNPJ duplicado"})
            }
        })
    }

    async cadastrarNovoPadrao(req, res){
        let { responsavel, idUsuario } = req.body

        let responsavelFormatado = limparDados(responsavel);

        await responsavelDao.cadastrarNovoPadrao(responsavelFormatado, idUsuario).then(response => {
            res.status(200).json({ falha: false, dados: { responsavel: response}})
        }).catch(erro => {
            if (erro.code == "23505") {
                res.status('500').json({falha: true, erro: "Nome ou CPF/CNPJ duplicado"})
            }
        })
    }

    async visualizarTodos(res){
        await responsavelDao.visualizarTodos().then(response => {
            res.status(200).json(response)
        })
    }
    async visualizarTodosNovoPadrao(req, res){
        let {pagina, itensPorPagina } = req.query

        let filtro = req.query.filtro || null

        try{
            let responsaveis = await responsavelDao.visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro)
            let total = await responsavelDao.contarResponsaveis(filtro)

            return res.status(200).json({ falha: false, dados: { responsaveis, total  } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async visualizar(req,res){
        const { id } = req.params
        await responsavelDao.visualizar(id).then(response => {
            res.status(200).json(response)
        })
    }
    async editar(req,res){
        let { responsavel, idUsuario } = req.body
        await responsavelDao.editar(responsavel, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editarNovoPadrao(req, res){
        let {responsavel, idUsuario} = req.body

        let responsavelFormatado = await limparDados(responsavel);

        await responsavelDao.editarNovoPadrao(responsavelFormatado, idUsuario).then(response => {
            res.status(200).json({falha: false, dados: {responsavel: response.responsavel}})
        }).catch(erro => {
            if (erro.code == "23505") {
                res.status('500').json({falha: true, erro: "Nome ou CPF/CNPJ duplicado"})
            }
        })
    }

    async deletar(req,res){
        let { id } = req.params
        await responsavelDao.deletar(id).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23503"){
                res.status('500').json({erro:"Esse responsável está vinculado a um imóvel"})
            }
        })
    }

    async deletarNovoPadrao(req, res){
        const {idResponsavel, idUsuario} = req.query

        await responsavelDao.deletarNovoPadrao(idResponsavel, idUsuario).then(responsavel => {
            res.status(200).json({falha: false, responsavel})
        }).catch(erro => {
            if (erro.code == "23503") {
                res.status('500').json({erro: "Esse responsável está vinculado a um imóvel"})
            }
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await responsavelDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}
module.exports = new ResponsavelController()
