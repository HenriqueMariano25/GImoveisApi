const autenticacaoDao = require('../dao/autenticacaoDao')

class Usuario{
    constructor(usuario) {
        this.id = usuario.id
        this.nome = usuario.nome
        this.usuario = usuario.usuario
        this.email = usuario.email
        this.senha = usuario.senha
    }

    static async buscaPorUsuario(user){
        const usuario = await autenticacaoDao.buscaPorUsuario(user)
        if(!usuario){
            return null
        }
        return new Usuario(usuario)
    }

    static async buscaPorId(id){
        const usuario = await autenticacaoDao.buscaPorId(id)
        if(!usuario){
            return null
        }
        return new Usuario(usuario)
    }

}

module.exports = Usuario