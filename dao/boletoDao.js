const db = require('../db/conexao')

module.exports = {
    aplicarReajuste: (valor, dataHoje, idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE boleto SET valor = '${valor}' 
            WHERE data_vencimento >= '${dataHoje}' 
            AND id_contrato = ${idContrato} 
            RETURNING id, valor`,
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