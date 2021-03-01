const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                    ORDER BY nome`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    cadastrar:(usuario, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO usuario(nome,email,senha,usuario,id_permissao, criado_em, alterado_em, criado_por, alterado_por) 
            VALUES ('${usuario.nome}', '${usuario.email}', '${usuario.senha}', '${usuario.usuario}',${usuario.permissao},
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}
             ) RETURNING nome, id`, (erro, resultado) => {
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
            db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.id permissao, usu.senha FROM usuario usu
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

    editar: (idUsuario, usuario, alteradoPor) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`UPDATE usuario
          SET nome = '${usuario.nome}', email = '${usuario.email}', usuario = '${usuario.usuario}',
           id_permissao = ${usuario.permissao}, senha = '${usuario.senha}',  alterado_em = '${agora}', alterado_por = ${alteradoPor}
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
