const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    alugueisPendentes: async (filtro) => {
        try{
            let sql = `SELECT bol.id, bol.id_contrato, imo.nome imovel, stabol.descricao status, cli.nome cliente,
                bol.data_vencimento, bol.valor
                FROM boleto bol
                INNER JOIN contrato con ON con.id = bol.id_contrato
                INNER JOIN imovel imo ON imo.id = con.id_imovel
                INNER JOIN cliente cli ON cli.id = con.id_cliente
                INNER JOIN status_boleto stabol ON stabol.id = bol.id_status_boleto
                WHERE bol.valor NOT IN('undefined', 'NaN') AND bol.id_status_boleto IN (1, 2)${ filtro ? filtro : "" } `;

            return await db.query(sql).then(resp => resp.rows)
        }catch(error){
            console.log(error)
        }

    }
}