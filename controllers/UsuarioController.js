const usuarioDao = require('../dao/usuarioDao')

class UsuarioController {
    async visualizarTodos(res) {
        await usuarioDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })
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

    async deletar(req, res){
        const idUsuario = req.params.id
        await usuarioDao.deletar(idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async tiposPermissao(res){
        await usuarioDao.tiposPermissao().then(response => {
            res.status(200).json(response)
        })
    }
}
module.exports = new UsuarioController()
