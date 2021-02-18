const db = require('../db/conexao')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                 cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento , cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel  
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente 
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao
                 ORDER BY nome`,
                (erro, resultado) => {
                    if (erro) {
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    visualizar: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                 cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento , cli.cpf_cnpj,
                 cli.identidade,cli.data_nascimento, cli.referencia , cli.numero, sta.id status,
                 cli.id, cli.cep,cli.id_estado_civil estado_civil,ARRAY_AGG(tel.id) id_telefone, 
                 ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tel.id_tipo_telefone) tipo_telefone, cli.observacao
                FROM cliente cli
                FULL OUTER JOIN telefone tel ON tel.id_cliente = cli.id
                FULL OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                WHERE cli.id = ${idCliente}
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows[0])
                })
        })
    },

    cadastrar: cliente => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO cliente(
            nome,rua,cep,bairro,cidade,estado,complemento,cpf_cnpj,identidade,email,referencia,data_nascimento, id_estado_civil,
            numero, id_status_cliente, observacao
            ) VALUES (
            '${cliente.nome}','${cliente.rua}','${cliente.cep}','${cliente.bairro}','${cliente.cidade}',
            '${cliente.estado}','${cliente.complemento}',${cliente.cpf_cnpj},${cliente.identidade},
            '${cliente.email}','${cliente.referencia}','${cliente.data_nascimento}',${cliente.estado_civil}, 
            '${cliente.numero}', ${cliente.status}, '${cliente.observacao}'
            ) RETURNING nome, id`, (erro, resultado) => {
                if (erro) {
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editar: (idCliente, dadosCliente) => {
      return new Promise((resolve, reject) =>{
          db.query(`UPDATE cliente
          SET nome = '${dadosCliente.nome}', rua = '${dadosCliente.rua}',bairro = '${dadosCliente.bairro}', 
          cidade = '${dadosCliente.cidade}', estado = '${dadosCliente.estado}', complemento = '${dadosCliente.complemento}',
          identidade = ${dadosCliente.identidade}, email = '${dadosCliente.email}', referencia = '${dadosCliente.referencia}',
          id_estado_civil = ${dadosCliente.estado_civil}, cpf_cnpj = ${dadosCliente.cpf_cnpj}, cep = ${dadosCliente.cep},
          data_nascimento = '${dadosCliente.data_nascimento}',numero = ${dadosCliente.numero}, 
          id_status_cliente = ${dadosCliente.status}, observacao = '${dadosCliente.observacao}'
          WHERE id = ${idCliente} RETURNING nome, id`,(erro, resultado) => {
              if(erro){
                  console.log(erro)
                  return reject(erro)
              }
              return resolve(resultado.rows)
          })
      })
    },

    deletarCliente: idCliente => {
      return new Promise((resolve, reject) => {
          db.query(`DELETE FROM cliente WHERE id = ${idCliente}`,(erro,resultado) => {
              if(erro){
                  console.log(erro)
                  return reject(erro)
              }
              return resolve(resultado)
          })
      })
    },

    editarTelefone:(dadosTelefone) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE telefone
            SET numero = '${dadosTelefone.numero}', id_tipo_telefone = ${dadosTelefone.tipo}
            WHERE id = ${dadosTelefone.id}`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    cadastrarTelefone: (idCliente, numeroTelefone, tipoTelefone) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO telefone(  
            id_cliente,numero,id_tipo_telefone
            ) VALUES (
            ${idCliente}, '${numeroTelefone}',${tipoTelefone}
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarTelefoneCliente: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM telefone WHERE id_cliente = ${idCliente}`, (erro, resultado) =>{
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    tipoStatus: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM status_cliente ORDER BY descricao`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }

}
