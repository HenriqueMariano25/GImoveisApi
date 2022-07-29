const db = require("../db/conexao")

module.exports = {
  aplicarReajuste: (valor, dataHoje, idContrato) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE boleto SET valor = '${valor}' 
            WHERE data_vencimento >= '${dataHoje}' 
            AND id_contrato = ${idContrato} 
            RETURNING id, valor`,
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
      db.query(
        `
            SELECT bol.* , con.juros_multa, con.juros_mes, con.multa, cli.nome cliente_nome, imo.nome imovel_nome
            FROM boleto bol
            INNER JOIN contrato con ON bol.id_contrato = con.id
            INNER JOIN imovel imo ON imo.id = con.id_imovel
            INNER JOIN cliente cli ON cli.id = con.id_cliente
            WHERE bol.data_vencimento < '${diaAtual}' AND bol.id_status_boleto != 3 AND con.deletado = 'false'
            AND con.id_status_contrato = 1
            AND (bol.data_quitacao = '' OR bol.data_quitacao is null) 
            ORDER BY data_vencimento;`,
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
  aplicarJuros: (boleto) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE boleto SET valor_juros = '${boleto.valor_juros}' WHERE id = ${boleto.id}`,
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
  alterarParaAtrasado: (idBoleto) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE boleto SET id_status_boleto = 2 WHERE id = ${idBoleto}`,
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
