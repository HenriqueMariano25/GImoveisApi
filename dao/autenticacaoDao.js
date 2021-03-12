const db = require('../db/conexao')
module.exports = {
    buscaPorUsuario: usuario => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
            usuario.id, 
            usuario.email,
            usuario.usuario, 
            usuario.nome,
            usuario.id_permissao ,
            usuario.senha
            FROM usuario 
            WHERE usuario = '${usuario}' AND usuario.deletado = ${false}`,
                (erro, resultado) => {
                    if (erro) {
                        return reject('Não foi possivel encontrar o usuario')
                    }
                    return resolve(resultado.rows[0])
                })
        })
    },

    buscaPorId: id => {
        return new Promise(((resolve, reject) => {
            db.query(`SELECT * FROM auth_user WHERE id = '${id}'`,
                (erro, resultado) => {
                    if (erro) {
                        return reject('Não foi possivel encontrar o usuario')
                    }

                    return resolve(resultado.rows[0])
                })
        }))
    },

    trocarSenha: (id, novaSenha) => {
        return new Promise(((resolve, reject) => {
            db.query(`UPDATE Auth_User SET password = '${novaSenha}' WHERE id = ${id}`,
                (erro, resultado) => {
                    if (erro) {
                        return reject(erro)
                    }

                    return resolve(resultado)
                })
        }))
    },
}
