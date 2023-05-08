const db = require('../db/conexao')

module.exports = {
    contratosVencendo: (diaVencimento, diaAtual) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id, con.data_fim, imo.nome
                FROM contrato con
                LEFT OUTER JOIN imovel imo ON imo.id = con.id_imovel
                WHERE data_fim <= '${diaVencimento}' AND data_fim >= '${diaAtual}' AND deletado = 'false' 
                AND id_status_contrato = 1
                ORDER BY data_fim ASC
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

    todosContratos: async () => {
        let sql = `SELECT con.id, con.id_status_contrato, stc.descricao status FROM contrato con LEFT JOIN status_contrato stc ON stc.id = con.id_status_contrato`



        try{
            let resultado = await db.query(sql)

            return resultado.rows
        }catch(error){
            console.log(error)
            return error
        }

        // console.log(resultado.rows)

        // return resultado
    }
}
