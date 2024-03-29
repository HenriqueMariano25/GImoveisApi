const db = require("../db/conexao");
const dayjs = require("dayjs");

module.exports = {
  visualizarTodos: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
                 cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cep, cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id 
                WHERE cli.deletado_em IS NULL
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
                 ORDER BY nome`,
        (erro, resultado) => {
          if (erro) {
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  visualizarTodosNovoPadrao: (pagina, itensPorPagina, filtro) => {

    console.log(filtro)

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT  cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cep, cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id 
                WHERE cli.deletado_em IS NULL ${filtro ? `AND unaccent(cli.nome) ILIKE unaccent('%${filtro}%') OR unaccent(sta.descricao) ILIKE unaccent('%${filtro}%') 
                OR unaccent(cli.cpf_cnpj) ILIKE unaccent('%${filtro}%')` : ""}
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
                 ORDER BY nome
                 LIMIT ${itensPorPagina} 
                OFFSET ${(parseInt(pagina) - 1) * parseInt(itensPorPagina)}`,
        (erro, resultado) => {
          if (erro) {
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  contarClientes: async (filtro) => {
    return await db.query(`SELECT COUNT( DISTINCT cli.id) total FROM cliente cli 
      FULL OUTER JOIN telefone tel ON tel.id_cliente = cli.id
                      LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                      LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id 
        WHERE cli.deletado_em IS NULL ${filtro ? `AND unaccent(cli.nome) ILIKE unaccent('%${filtro}%') OR unaccent(sta.descricao) ILIKE unaccent('%${filtro}%') 
                OR unaccent(cli.cpf_cnpj) ILIKE unaccent('%${filtro}%')` : ""}`).then(resp => resp.rows[0].total)
  },

  visualizar: (idCliente) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
                 cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento , cli.cpf_cnpj,
                 cli.identidade,cli.data_nascimento, cli.referencia , cli.numero, sta.id status,
                 cli.id, cli.cep,cli.id_estado_civil estado_civil,ARRAY_AGG(tel.id) id_telefone, 
                 ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tel.id_tipo_telefone) id_tipo_telefone, 
                 ARRAY_AGG(tip_tel.descricao) tipo_telefone,ARRAY_AGG(tel.observacao) observacao_telefone ,cli.observacao, cli.tipo_cliente
                FROM cliente cli
                FULL OUTER JOIN telefone tel ON tel.id_cliente = cli.id AND tel.deletado_em IS NULL
                FULL JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
                FULL OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                WHERE cli.id = ${idCliente}
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.tipo_cliente`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado.rows[0]);
        }
      );
    });
  },

  visualizarBusca: (busca) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
                 cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cep, cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id 
                 WHERE LOWER(cli.nome) LIKE LOWER('%${busca}%') OR LOWER(sta.descricao) LIKE LOWER('%${busca}%')
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
                 ORDER BY nome`,
        (erro, resultado) => {
          if (erro) {
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  cadastrar: async (cliente, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let insert = await db
      .query(
        `INSERT INTO cliente(nome,rua,cep,bairro,cidade,estado,complemento,cpf_cnpj,identidade,email,referencia,data_nascimento, id_estado_civil,numero, id_status_cliente, observacao, tipo_cliente, criado_em, alterado_em, criado_por, alterado_por) VALUES (
            '${cliente.nome}','${cliente.rua}','${cliente.cep}','${cliente.bairro}','${cliente.cidade}','${cliente.estado}','${cliente.complemento}','${cliente.cpf_cnpj}','${cliente.identidade}',
            '${cliente.email}','${cliente.referencia}','${cliente.data_nascimento}',${cliente.estado_civil},
            '${cliente.numero}', ${cliente.status}, '${cliente.observacao}', '${cliente.tipo_cliente}',
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}
            ) RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject(e);
      });

    let select = await db
      .query(
        `SELECT 
                 cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cep, cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
                WHERE cli.id = ${insert.id} 
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
            `
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    return { cliente: select };
  },

  editar: async (idCliente, cliente, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let update = await db
      .query(
        `UPDATE cliente
            SET nome = '${cliente.nome.replace("'", "''")}', rua = '${
          cliente.rua
        }', bairro = '${cliente.bairro}', estado = '${cliente.estado}',
            cidade = '${cliente.cidade}',  complemento = '${
          cliente.complemento
        }',identidade = '${cliente.identidade}', 
            email = '${cliente.email.trim()}', referencia = '${
          cliente.referencia
        }',id_estado_civil = ${cliente.estado_civil}, 
            cpf_cnpj = '${cliente.cpf_cnpj}', cep = '${
          cliente.cep
        }',data_nascimento = '${cliente.data_nascimento}',
            numero = '${cliente.numero}', id_status_cliente = ${
          cliente.status
        }, observacao = '${cliente.observacao}', 
            tipo_cliente = '${
              cliente.tipo_cliente
            }', alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${idCliente} RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
        return Promise.reject(e);
      });

    let select = await db
      .query(
        `SELECT 
                 cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cep, cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
                WHERE cli.id = ${update.id} 
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
            `
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    return { cliente: select };
  },

  deletarCliente: (idCliente) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM cliente WHERE id = ${idCliente}`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado);
        }
      );
    });
  },

  deletarClienteNovoPadrao: async (idCliente, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let resp = await db
      .query(
        `UPDATE cliente SET deletado_por = ${idUsuario}, deletado_em = '${agora}' WHERE id = ${idCliente} RETURNING id`
      )
      .then((resultado) => {
        return resultado.rows;
      })
      .catch((erro) => erro);

    return resp;
  },

  editarTelefone: async (telefone, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let update = await db
      .query(
        `UPDATE telefone
            SET numero = '${telefone.numero.trim()}', id_tipo_telefone = ${
          telefone.id_tipo_telefone
        }, 
            observacao = '${telefone.observacao.trim()}', alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${telefone.id} RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    let select = await db
      .query(
        `SELECT tel.id, tel.id_tipo_telefone , tel.numero, tel.observacao, tip_tel.descricao tipo_telefone
            FROM telefone tel
            LEFT JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
            WHERE tel.id = ${update.id}`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    return { telefone: select };
  },

  cadastrarTelefone: async (idCliente, telefone, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let insert = await db
      .query(
        `INSERT INTO telefone(  
            id_cliente,numero,id_tipo_telefone,observacao, criado_em, alterado_em, criado_por, alterado_por
            ) VALUES (
            ${idCliente}, '${telefone.numero.trim()}',${
          telefone.id_tipo_telefone
        }, '${telefone.observacao.trim()}',
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}
            ) RETURNING id`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    console.log(insert);

    let select = await db
      .query(
        `SELECT tel.id, tel.id_tipo_telefone , tel.numero, tel.observacao, tip_tel.descricao tipo_telefone
            FROM telefone tel
            LEFT JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
            WHERE tel.id = ${insert.id}`
      )
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    return { telefone: select };
  },

  deletarTelefoneCliente: (idCliente) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM telefone WHERE id_cliente = ${idCliente}`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  deletarTelefone: async (idTelefone) => {
    let deletado = await db
      .query(`DELETE FROM telefone WHERE id = ${idTelefone} RETURNING id`)
      .then((resp) => {
        return resp.rows[0];
      })
      .catch((e) => {
        console.log(e);
      });

    return { telefone: deletado };
  },

  deletarTelefoneNovoPadrao: async (idTelefone, idUsuario) => {
    let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

    let resp = await db
      .query(
        `UPDATE telefone SET deletado_por = ${idUsuario}, deletado_em = '${agora}' WHERE id = ${idTelefone}`
      )
      .then((resultado) => {
        return { falha: false, dados: { resultado: resultado.rows } };
      })
      .catch((erro) => {
        return { falha: true, erro };
      });

    return resp;
  },

  tipoStatus: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM status_cliente ORDER BY descricao`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  contratos: (idCliente) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT con.id, con.data_inicio, con.data_fim, imo.nome, sta_con.descricao status, pdf.nome nome_pdf
             FROM contrato con 
             LEFT JOIN imovel imo ON con.id_imovel = imo.id
             LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
             LEFT JOIN pdf_contrato pdf ON pdf.id_contrato = con.id
             WHERE id_cliente = ${idCliente} OR id_cliente2 = ${idCliente} AND deletado = 'false'`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },

  boletos: (idContrato) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT bol.id, bol.data_vencimento , sta_bol.descricao status, bol.valor, bol.data_quitacao
            FROM boleto bol
            LEFT JOIN status_boleto sta_bol ON bol.id_status_boleto = sta_bol.id 
            WHERE id_contrato = ${idContrato} ORDER BY data_vencimento`,
        (erro, resultado) => {
          if (erro) {
            console.log(erro);
            return reject(erro);
          }
          return resolve(resultado.rows);
        }
      );
    });
  },
};
