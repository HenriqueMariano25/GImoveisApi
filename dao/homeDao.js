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
            db.query(`
            SELECT bol.* , con.juros_multa, con.juros_mes, con.multa
            FROM boleto bol
            INNER JOIN contrato con ON bol.id_contrato = con.id
            WHERE bol.data_vencimento < '${diaAtual}' AND bol.id_status_boleto != 3 
            AND (bol.data_quitacao = '' OR bol.data_quitacao is null) ORDER BY id_contrato, data_vencimento`,
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
    },
    aplicarJuros: (boleto) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE boleto SET valor_juros = '${boleto.valor_juros}' WHERE id = ${boleto.id}`,
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