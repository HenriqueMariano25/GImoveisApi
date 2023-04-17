const usuarioDao = require('../dao/usuarioDao')
const caixaDao = require("../dao/caixaDao");
const clienteDao = require("../dao/clienteDao");

class UsuarioController {
    async visualizarTodos(res) {
        await usuarioDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async visualizarTodosNovoPadrao(req, res) {
        let {pagina, itensPorPagina} = req.query

        let filtro = req.query.filtro || null

        try {
            let usuarios = await usuarioDao.visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro)
            let total = await usuarioDao.contarUsuarios(filtro)
            // let total = 0

            return res.status(200).json({falha: false, dados: {total, usuarios}})
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async cadastrar(req,res) {
        let { usuario, idUsuario } = req.body
        await usuarioDao.cadastrar(usuario, idUsuario).then(consulta => {
            res.status(200).json(consulta)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome do operador ou Usuário duplicado"})
            }
        })
    }

    async cadastrarNovoPadrao(req, res) {
        let {usuario, idUsuario} = req.body

        await usuarioDao.cadastrar(usuario, idUsuario).then(consulta => {
            res.status(200).json({ falha: false, dados: { usuario: consulta } })
        }).catch(erro => {
            if (erro.code == "23505") {
                res.status('500').json({falha: true, erro: "Nome do operador ou Usuário duplicado"})
            }
        })
    }

    async visualizar(req,res){
        const idUsuario = req.params.id
        await usuarioDao.visualizar(idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editar(req,res){
        let { usuario, idUsuario } = req.body
        const usuarioId = req.params.id
        await usuarioDao.editar(idUsuario, usuario, usuarioId).then(response => {
            res.status(200).json(response)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome do operador ou Usuário duplicado"})
            }
        })
    }

    async editarNovoPadrao(req, res) {
        let {usuario, idUsuario} = req.body

        await usuarioDao.editarNovoPadrao(idUsuario, usuario).then(response => {
            res.status(200).json({ falha:false, dados: { usuario: response}})
        }).catch(erro => {
            if (erro.code == "23505") {
                res.status('500').json({falha: true, erro: "Nome do operador ou Usuário duplicado"})
            }
        })
    }

    async deletar(req, res){
        const idUsuario = req.params.id
        await usuarioDao.deletar(idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarNovoPadrao(req, res) {
        const { idUsuario, idUsuarioDeletando } = req.query

        await usuarioDao.deletarNovoPadrao(idUsuario, idUsuarioDeletando).then(usuario => {

            res.status(200).json({ falha: false, usuario })
        }).catch( erro => res.status(500).json({ falha: true, erro }))
    }

    async tiposPermissao(res){
        await usuarioDao.tiposPermissao().then(response => {
            res.status(200).json(response)
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await usuarioDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}
module.exports = new UsuarioController()
