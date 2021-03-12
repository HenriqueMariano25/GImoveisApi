const usuarioDao = require('../dao/usuarioDao')

class UsuarioController {
    async visualizarTodos(res) {
        await usuarioDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })

    }

    async cadastrar(req,res) {
        const usuario = req.body.data
        const idUsuario = req.body.idUsuario
        await usuarioDao.cadastrar(usuario, idUsuario).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async visualizar(req,res){
        const idUsuario = req.params.id
        await usuarioDao.visualizar(idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editar(req,res){
        const idUsuario = req.params.id
        const usuario = req.body.data
        const alteradoPor = req.body.idUsuario
        await usuarioDao.editar(idUsuario, usuario, alteradoPor).then(response => {
            res.status(200).json(response)
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
