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

    visualizarTodosNovoPadrao: (pagina, itensPorPagina, filtro) => {
        let sql = `SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao, usu.deletado
                    FROM usuario usu
                    LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE usu.deletado = ${false} AND usu.deletado_em IS NULL
                   ${ filtro ? `AND ( unaccent(usu.nome) ILIKE unaccent('%${filtro}%')
                   OR unaccent(usu.email) ILIKE unaccent('%${filtro}%')
                   OR unaccent(usu.usuario) ILIKE unaccent('%${filtro}%')
                   OR unaccent(per.descricao) ILIKE unaccent('%${filtro}%') )` : ""}
                    ORDER BY nome
                    LIMIT ${itensPorPagina}
                    OFFSET ${(parseInt(pagina) - 1) * parseInt(itensPorPagina)}`
        return new Promise((resolve, reject) => {
            db.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    } ,

    contarUsuarios: async (filtro) => {
        return await db.query(`SELECT COUNT(usu.id) total FROM usuario usu LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao WHERE usu.deletado = ${false} 
        AND usu.deletado_em IS NULL ${ filtro ? `AND ( unaccent(usu.nome) ILIKE unaccent('%${filtro}%')
                   OR unaccent(usu.email) ILIKE unaccent('%${filtro}%')
                   OR unaccent(usu.usuario) ILIKE unaccent('%${filtro}%')
                   OR unaccent(per.descricao) ILIKE unaccent('%${filtro}%') )` : ""}`).then(resp => resp.rows[0].total)
    },

    cadastrar: async (usuario, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let insert = await db.query(`INSERT INTO usuario(nome,email,senha,usuario,id_permissao, criado_em, alterado_em, criado_por, alterado_por, deletado) 
            VALUES ('${usuario.nome.trim()}', '${usuario.email.trim()}', '${usuario.senha}', '${usuario.usuario.trim()}',${usuario.permissao},
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${false}
             ) RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao,usu.deletado FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE usu.id = ${insert.id}
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {usuario: select}
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

    editar: async (idUsuario, usuario, usuarioId) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        let update = await db.query(`UPDATE usuario
          SET nome = '${usuario.nome.trim()}', email = '${usuario.email.trim()}', usuario = '${usuario.usuario.trim()}',
           id_permissao = ${usuario.permissao}, senha = '${usuario.senha}',  alterado_em = '${agora}', alterado_por = ${idUsuario}
           WHERE id = ${usuarioId} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao,usu.deletado FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE usu.id = ${update.id}
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {usuario: select}
    },

    editarNovoPadrao: async (idUsuario, usuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        let update = await db.query(`UPDATE usuario
          SET nome = '${usuario.nome.trim()}', email = '${usuario.email.trim()}', usuario = '${usuario.usuario.trim()}',
           id_permissao = ${usuario.permissao}, senha = '${usuario.senha}',  alterado_em = '${agora}', alterado_por = ${idUsuario}
           WHERE id = ${usuario.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao,usu.deletado FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE usu.id = ${update.id}
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {usuario: select}
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

    deletarNovoPadrao: (idUsuario, idUsuarioDeletando) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

        return new Promise((resolve, reject) => {
            db.query(`UPDATE usuario SET deletado = ${true}, deletado_em = '${agora}',
               deletado_por = ${idUsuarioDeletando}
            WHERE id = ${idUsuario} RETURNING nome, id`, (erro, resultado) => {
                if (erro) {
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
    },

    visualizarBusca: (busca) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT usu.id, usu.nome, usu.email, usu.usuario, per.descricao permissao,usu.deletado FROM usuario usu
                   LEFT OUTER JOIN permissao per ON per.id = usu.id_permissao
                   WHERE deletado = ${false} AND
                   LOWER(usu.nome) LIKE LOWER('%${busca}%')
                   OR LOWER(usu.email) LIKE LOWER('%${busca}%')
                   OR LOWER(usu.usuario) LIKE LOWER('%${busca}%')
                   OR LOWER(per.descricao) LIKE LOWER('%${busca}%')
                    ORDER BY nome
                `,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                }
            )
        })
    },
}
