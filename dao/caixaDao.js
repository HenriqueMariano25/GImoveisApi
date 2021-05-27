const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    cadastrar: (caixa, idUsuario) => {
        // console.log(caixa)
        // console.log(idUsuario)
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO caixa(
            movimento, valor, debito_credito, historico, complemento_historico, criado_em, alterado_em, criado_por , 
            alterado_por, id_imovel
            ) VALUES (
            '${caixa.movimento}', '${caixa.valor}', '${caixa.debitoCredito}', '${caixa.historico.trim()}',
            '${caixa.complementoHistorico}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${caixa.idImovel}
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
            db.query(`SELECT cai.id, cai.movimento, cai.debito_credito, cai.historico, cai.complemento_historico,
               imo.nome imovel_nome
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                }
            )
        })
    }
}