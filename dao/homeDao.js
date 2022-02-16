const db = require('../db/conexao')

module.exports = {
    contratosVencendo: (diaVencimento, diaAtual) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id, con.data_fim, imo.nome
                FROM contrato con
                LEFT OUTER JOIN imovel imo ON imo.id = con.id_imovel
                WHERE data_fim <= '${diaVencimento}' AND data_fim >= '${diaAtual}' AND deletado = 'false' 
            AND id_status_contrato = 1`,
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
