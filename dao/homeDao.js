const db = require('../db/conexao')

module.exports = {
    contratosVencendo: (diaVencimento) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, data_fim FROM contrato WHERE data_fim <= '${diaVencimento}'`,
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