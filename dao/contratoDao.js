const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf, sta_con.descricao status
                    FROM contrato con
                    INNER JOIN cliente cli ON con.id_cliente = cli.id
                    INNER JOIN imovel imo ON con.id_imovel = imo.id
                    INNER JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT OUTER JOIN pdf_contrato pdf on pdf.id_contrato = con.id
                    WHERE deletado = 'false'
                    ORDER BY con.id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    visualizar: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id, con.id_responsavel, con.id_cliente, con.id_cliente2, con.id_imovel, con.data_inicio, con.data_fim,
            con.vigencia, con.data_vencimento, con.valor_boleto, con.carencia, pdf.nome nome_pdf, con.observacao, con.garantia,
            con.id_status_contrato status
            FROM contrato con
            LEFT OUTER JOIN pdf_contrato pdf on pdf.id_contrato = con.id
            WHERE con.id = ${idContrato}`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    fiador: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM fiador WHERE id_contrato = ${idContrato}`,
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
    cadastrar: (contrato, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO contrato(id_responsavel,id_cliente,id_cliente2,id_imovel,data_inicio,data_fim,data_vencimento,
            valor_boleto,carencia, deletado, id_status_contrato, criado_em, alterado_em, criado_por, alterado_por, 
            observacao, garantia) 
            VALUES(
            ${contrato.id_responsavel}, ${contrato.id_cliente}, ${contrato.id_cliente2},${contrato.id_imovel},
            '${contrato.data_inicio}','${contrato.data_fim}','${contrato.data_vencimento}','${contrato.valor_boleto_convertido}',
            '${contrato.carencia}', 'false', ${contrato.status},'${agora}', '${agora}', ${idUsuario}, ${idUsuario}, 
            '${contrato.observacao.trim()}', '${contrato.garantia.trim()}'
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    editar: (contrato, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`UPDATE contrato SET id_responsavel = ${contrato.id_responsavel}, id_cliente = ${contrato.id_cliente},
            id_cliente2 = ${contrato.id_cliente2}, id_imovel = ${contrato.id_imovel}, data_inicio = '${contrato.data_inicio}', 
            valor_boleto = '${contrato.valor_boleto_convertido}',carencia = '${contrato.carencia}', 
            alterado_em = '${agora}', alterado_por = ${idUsuario}, observacao = '${contrato.observacao}',
             id_status_contrato = ${contrato.status}, garantia = '${contrato.garantia}'
             WHERE id = ${contrato.id} RETURNING id`,
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
    gerarBoleto: (idContrato, data_vencimento, contrato) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO boleto(id_contrato, data_vencimento, valor, id_status_boleto) VALUES(
            ${idContrato}, '${data_vencimento}', '${contrato.valor_boleto_convertido}', 1) 
            RETURNING id, data_vencimento`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    deletar: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM contrato WHERE id = ${idContrato}`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado)
            })
        })
    },
    deletarContrato: idContrato => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE contrato SET deletado = ${true} WHERE id = ${idContrato} RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    status: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, descricao FROM status_contrato ORDER BY descricao`,
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
    deletarBoletos: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM boleto WHERE id_contrato = ${idContrato}`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado)
            })
        })
    },
    responsaveis: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id,nome FROM responsavel ORDER BY nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    clientes: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id,nome FROM cliente ORDER BY nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    imoveis: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id,nome FROM imovel ORDER BY nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    idFiador: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id,descricao FROM id_fiador ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    boletos: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT bol.id, bol.data_vencimento, sta.descricao status, bol.valor, bol.data_quitacao
        FROM boleto bol
        INNER JOIN status_boleto sta ON bol.id_status_boleto = sta.id
        WHERE bol.id_contrato = ${idContrato} ORDER BY data_vencimento`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    boleto: (idBoleto) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT bol.id, bol.data_vencimento, bol.id_status_boleto, bol.valor, bol.data_quitacao
                FROM boleto bol
                WHERE bol.id = ${idBoleto}`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    statusBoleto: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM status_boleto ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    editarBoleto: (boleto) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE boleto SET data_vencimento = '${boleto.data_vencimento}', data_quitacao = '${boleto.data_quitacao}',
            valor = '${boleto.valor}', id_status_boleto = ${boleto.id_status_boleto} WHERE id = ${boleto.id} 
            RETURNING id, id_contrato`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    cadastrarBoleto: (boleto, idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO boleto
            (id_contrato, data_vencimento, data_quitacao, valor, id_status_boleto) 
            VALUES 
            (${idContrato}, '${boleto.data_vencimento}', '${boleto.data_quitacao}', '${boleto.valor}', ${boleto.id_status_boleto}) 
            RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    deletarBoleto: (idBoleto) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM boleto WHERE id = ${idBoleto} RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    importarPDF: (url, contrato, nome) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO pdf_contrato(url, id_contrato, nome) VALUES('${url}', ${contrato}, '${nome}') RETURNING id, nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    deletarPDF: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM pdf_contrato WHERE id_contrato = ${idContrato} RETURNING id, nome, url`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    cadastrarFiador: (fiador, idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO fiador(nome, id_estado_civil, data_nascimento,email,cpf_cnpj, identidade, cep, rua, 
            numero, complemento, bairro, cidade, estado, id_contrato, telefone)
          VALUES(
              '${fiador.nome}', ${fiador.estado_civil}, '${fiador.data_nascimento}', '${fiador.email}', '${fiador.cpf_cnpj}',
              '${fiador.identidade}', '${fiador.cep}', '${fiador.rua}','${fiador.numero}', '${fiador.complemento}', 
              '${fiador.bairro}', '${fiador.cidade}', '${fiador.estado}', ${idContrato}, '${fiador.telefone}')
          RETURNING id`,
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
    fiadores: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * From fiador WHERE id_contrato = ${idContrato}`,
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
    editarFiador: (fiador) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE fiador SET nome = '${fiador.nome}', rua = '${fiador.rua}', bairro = '${fiador.bairro}',
          cidade = '${fiador.cidade}', estado = '${fiador.estado}', complemento = '${fiador.complemento}',
          email = '${fiador.email}', id_estado_civil = ${fiador.estado_civil}, cpf_cnpj = '${fiador.cpf_cnpj}',
          identidade = '${fiador.identidade}', data_nascimento = '${fiador.data_nascimento}', cep = '${fiador.cep}',
          telefone = '${fiador.telefone}'
          WHERE id = ${fiador.id}`,
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
    deletarFiador: (idFiador) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM fiador WHERE id = ${idFiador} RETURNING id, nome`,
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
