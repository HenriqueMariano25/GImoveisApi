const db = require('../db/conexao')
const dayjs = require('dayjs')

let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

module.exports = {
    cadastrarConta: (conta, idUsuario) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO conta(nome, criado_em, alterado_em, criado_por, alterado_por) 
                VALUES
                ('${conta.nome}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario})`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
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

    editarConta: (conta, idUsuario) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE conta SET nome = '${conta.nome}', alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${conta.id} RETURNING id, nome`,
                (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                }
            )
        })
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
    cadastrarHistorico: (historico) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO historico(descricao) 
                VALUES
                ('${historico.descricao}')`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
}