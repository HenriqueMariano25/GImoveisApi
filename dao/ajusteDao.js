const db = require('../db/conexao')
const dayjs = require('dayjs')

let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

module.exports = {
    cadastrarConta: async (conta, idUsuario) => {
        let insert = await db.query(`INSERT INTO conta(nome, criado_em, alterado_em, criado_por, alterado_por) 
                VALUES
                ('${conta.nome}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario}) RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT nome, id FROM conta
               WHERE id = ${insert.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {conta: select}
    },

    visualizarTodasContas: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT nome, id FROM conta ORDER BY nome`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    editarConta: async (conta, idUsuario) => {
        let update = await db.query(`UPDATE conta SET nome = '${conta.nome}', alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${conta.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT nome, id FROM conta WHERE id = ${update.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {conta: select}

    },

    visualizarTodosHistoricos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT descricao, id FROM historico ORDER BY descricao`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    cadastrarHistorico: async (historico) => {
        let insert = await db.query(`INSERT INTO historico(descricao) 
                VALUES
                ('${historico.descricao}') RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT descricao, id FROM historico
               WHERE id = ${insert.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {historico: select}
    },

    editarHistorico: async (historico) => {
        let update = await db.query(`UPDATE historico SET descricao = '${historico.descricao}' WHERE id = ${historico.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT descricao, id FROM historico WHERE id = ${update.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {historico: select}
    },

    deletarHistorico: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM historico WHERE id = ${id} RETURNING id, descricao`, (erro, resultado) => {
                if (erro) {
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }
}