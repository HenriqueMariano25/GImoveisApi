const db = require('../db/conexao')

module.exports = {
    contratosVencendo: (diaVencimento, diaAtual) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, data_fim FROM contrato WHERE data_fim <= '${diaVencimento}' AND data_fim >= '${diaAtual}'`,
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
    boletosVencendo: (diaAtual) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM boleto WHERE data_vencimento < '${diaAtual}' AND id_status_boleto != 3 
            AND (data_quitacao = '' OR data_quitacao is null) ORDER BY id_contrato, data_vencimento`,
                (erro,resultado) => {
                    if(erro){
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    alterarParaAtrasado: (idBoleto) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE boleto SET id_status_boleto = 2 WHERE id = ${idBoleto}`,
                (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    }
}