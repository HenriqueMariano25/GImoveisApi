const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao,usu.deletado FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE deletado = ${false}
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
            db.query(`INSERT INTO usuario(nome,email,senha,usuario,id_permissao, criado_em, alterado_em, criado_por, alterado_por, deletado) 
            VALUES ('${usuario.nome.trim()}', '${usuario.email.trim()}', '${usuario.senha}', '${usuario.usuario.trim()}',${usuario.permissao},
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${false}
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
          SET nome = '${usuario.nome.trim()}', email = '${usuario.email.trim()}', usuario = '${usuario.usuario.trim()}',
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
            db.query(`UPDATE usuario SET deletado = ${true} WHERE id = ${idUsuario} RETURNING nome, id`, (erro, resultado) => {
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
