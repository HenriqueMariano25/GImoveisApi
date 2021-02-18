const db = require('../db/conexao')
module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao FROM usuario usu
                   FULL OUTER JOIN permissao per ON per.id = usu.id_permissao
                    ORDER BY nome`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    cadastrar:(usuario) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO usuario(nome,email,senha,usuario,id_permissao) 
            VALUES ('${usuario.nome}', '${usuario.email}', '123456', '${usuario.usuario}',
             ${usuario.permissao}) RETURNING nome, id`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    visualizar: (idUsusario) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.id permissao FROM usuario usu
                   FULL OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE usu.id = ${idUsusario}
                    ORDER BY nome`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows[0])
            })
        })
    },

    editar: (idUsuario, usuario) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE usuario
          SET nome = '${usuario.nome}', email = '${usuario.email}', usuario = '${usuario.usuario}',
           id_permissao = ${usuario.permissao}
           WHERE id = ${idUsuario} RETURNING nome,id`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows[0])
            })
        })
    },

    deletar: (idUsuario) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM usuario WHERE id = ${idUsuario} RETURNING nome, id`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },



    tiposPermissao: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id as value, descricao as text FROM permissao ORDER BY descricao`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }
}