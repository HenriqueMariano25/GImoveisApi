const db = require("../db/conexao")
const dayjs = require("dayjs")

let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

module.exports = {
  cadastrar: async (caixa, idUsuario) => {
    let insert = await db
      .query(
        `INSERT INTO caixa(
                movimento, valor, id_debito_credito, id_historico, complemento_historico, criado_em, alterado_em, criado_por , 
                alterado_por, id_imovel, id_conta, numero_documento
                ) VALUES (
                '${caixa.movimento}', ${caixa.valor}, ${caixa.id_debito_credito}, '${caixa.id_historico}',
                '${caixa.complemento_historico}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${caixa.id_imovel}, 
                ${caixa.id_conta}, '${caixa.numero_documento}'
                ) RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0]
      })
      .catch((e) => {
        console.log(e)
      })

    let select = await db
      .query(
        `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                where cai.id = ${insert.id}`
      )
      .then((resp) => {
        return resp.rows[0]
      })
      .catch((e) => {
        console.log(e)
      })

    return { caixa: select }
  },

  cadastrarNovoPadrao: async (caixa, idUsuario) => {
    let insert = await db
        .query(
            `INSERT INTO caixa(
                movimento, valor, id_debito_credito, id_historico, complemento_historico, criado_em, alterado_em, criado_por , 
                alterado_por, id_imovel, id_conta, numero_documento
                ) VALUES (
                ${caixa.movimento}, ${caixa.valor}, ${caixa.id_debito_credito}, ${caixa.id_historico},
                ${caixa.complemento_historico}, '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, ${caixa.id_imovel}, 
                ${caixa.id_conta}, ${caixa.numero_documento}
                ) RETURNING id`
        )
        .then((resp) => {
          return resp.rows[0]
        })
        .catch((e) => {
          console.log(e)
        })

    let select = await db
        .query(
            `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                where cai.id = ${insert.id}`
        )
        .then((resp) => {
          return resp.rows[0]
        })
        .catch((e) => {
          console.log(e)
        })

    return {caixa: select}
  },

  visualizarTodos: (page, size) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT count(*) OVER() AS total_itens, cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                ORDER BY cai.movimento DESC
                LIMIT ${size}
                OFFSET ${page * size}`,
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

  visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro){
    return new Promise((resolve, reject) => {
      db.query(
          `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                WHERE cai.deletado_em IS NULL ${filtro ? `AND LOWER(imo.nome) LIKE LOWER('%${filtro}%') OR
                 LOWER(his.descricao) LIKE LOWER('%${filtro}%') OR
                 LOWER(con.nome) LIKE LOWER('%${filtro}%') OR 
                 cai.id::varchar(255) LIKE LOWER('%${filtro}%') ` : ''} 
                ORDER BY cai.movimento DESC
                LIMIT ${itensPorPagina}
                OFFSET ${(parseInt(pagina) - 1) * parseInt(itensPorPagina)}`,
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

  contarCaixas: async (filtro) => {
    return await db.query(`
            SELECT 
                COUNT(cai.id) total
            FROM caixa cai 
            WHERE 
                deletado_em IS NULL 
                ${filtro ? `AND LOWER(imo.nome) LIKE LOWER('%${filtro}%') OR
                 LOWER(his.descricao) LIKE LOWER('%${filtro}%') OR
                 LOWER(con.nome) LIKE LOWER('%${filtro}%') OR 
                 cai.id::varchar(255) LIKE LOWER('%${filtro}%') ` : ''} 
            `)
        .then(resp => resp.rows[0].total)
  },

    visualizarCaixa(id){
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                WHERE cai.id = ${id}
                ORDER BY cai.movimento DESC
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

  editar: async (caixa, idUsuario) => {
    let update = await db
      .query(
        `UPDATE caixa SET movimento = '${caixa.movimento}', id_historico = '${caixa.id_historico}', 
            complemento_historico = '${caixa.complemento_historico}', id_conta = ${caixa.id_conta}, 
            valor = ${caixa.valor}, id_debito_credito = ${caixa.id_debito_credito}, id_imovel = ${caixa.id_imovel}, 
            alterado_em = '${agora}', alterado_por = ${idUsuario}, numero_documento = '${caixa.numero_documento}'
            WHERE id = ${caixa.id} RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0]
      })
      .catch((e) => {
        console.log(e)
      })

    let select = await db
      .query(
        `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                where cai.id = ${update.id}`
      )
      .then((resp) => {
        return resp.rows[0]
      })
      .catch((e) => {
        console.log(e)
      })

    return { caixa: select }
  },

    editarNovoPadrao: async (caixa, idUsuario) => {
        let update = await db
            .query(
                `UPDATE caixa SET movimento = ${caixa.movimento}, id_historico = ${caixa.id_historico}, 
            complemento_historico = ${caixa.complemento_historico}, id_conta = ${caixa.id_conta}, 
            valor = ${caixa.valor}, id_debito_credito = ${caixa.id_debito_credito}, id_imovel = ${caixa.id_imovel}, 
            alterado_em = '${agora}', alterado_por = ${idUsuario}, numero_documento = ${caixa.numero_documento}
            WHERE id = ${caixa.id} RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        let select = await db
            .query(
                `SELECT cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                where cai.id = ${update.id}`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {caixa: select}
    },

  deletar: async (idCaixa) => {
    let deletado = await db
      .query(`DELETE FROM caixa WHERE id = ${idCaixa} RETURNING id`)
      .then((resp) => {
        return resp.rows[0]
      })
      .catch((e) => {
        console.log(e)
      })

    return { caixa: deletado }
  },

    deletarNovoPadrao: async (idCaixa, idUsuario) =>{
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

        let resp = await db
            .query(
                `UPDATE caixa SET deletado_por = ${idUsuario}, deletado_em = '${agora}' WHERE id = ${idCaixa} RETURNING id`
            )
            .then((resultado) => {
                return resultado.rows;
            })
            .catch((erro) => erro);

        return resp;
    },

  buscarRelatorio: async(data_inicio, data_fim) =>{
    return new Promise((resolve, reject) => {
      db.query(
          `SELECT  cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                WHERE cai.deletado_em IS NULL AND cai.movimento BETWEEN '${data_inicio}' AND '${data_fim}'
                ORDER BY cai.movimento DESC`,
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

  visualizarBusca: (busca) => {
    return new Promise((resolve, reject) => {
      db.query(
          `SELECT count(*) OVER() AS total_itens, cai.id, cai.movimento, cai.id_debito_credito, cai.id_historico id_historico, cai.complemento_historico,
               imo.nome imovel_nome, imo.id id_imovel, cai.valor, cai.id_conta, cai.numero_documento, con.nome conta_nome,
               his.descricao descricao_historico
                FROM caixa cai
                LEFT JOIN imovel imo ON imo.id = cai.id_imovel
                LEFT JOIN conta con ON con.id = cai.id_conta
                LEFT JOIN historico his ON his.id = cai.id_historico
                WHERE LOWER(imo.nome) LIKE LOWER('%${busca}%') OR LOWER(his.descricao) LIKE LOWER('%${busca}%') 
                OR LOWER(con.nome) LIKE LOWER('%${busca}%') OR cai.id::varchar(255) LIKE LOWER('%${busca}%') 
                ORDER BY cai.movimento DESC
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
}
