const db = require('../db/conexao')
const dayjs = require('dayjs')

let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

module.exports = {
    cadastrar: (caixa, idUsuario) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO caixa(
            movimento, valor, id_debito_credito, historico, complemento_historico, criado_em, alterado_em, criado_por , 
            alterado_por, id_imovel, id_conta, numero_documento
            ) VALUES (
            '${caixa.movimento}', ${caixa.valor}, ${caixa.id_debito_credito}, '${caixa.historico.trim()}',
            '${caixa.complemento_historico}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${caixa.id_imovel}, 
            ${caixa.id_conta}, '${caixa.numero_documento}'
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                ORDER BY cai.movimento`,
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

    editar: (caixa, idUsuario) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE caixa SET movimento = '${caixa.movimento}', historico = '${caixa.historico}', 
            complemento_historico = '${caixa.complemento_historico}', id_conta = ${caixa.id_conta}, 
            valor = ${caixa.valor}, id_debito_credito = ${caixa.id_debito_credito}, id_imovel = ${caixa.id_imovel}, 
            alterado_em = '${agora}', alterado_por = ${idUsuario}, numero_documento = '${caixa.numero_documento}'
            WHERE id = ${caixa.id} RETURNING id`,
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

    deletar: (idCaixa) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM caixa WHERE id = ${idCaixa} RETURNING id`,
                (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                }
            )
        })
    }
}