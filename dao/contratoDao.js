const db = require('../db/conexao')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT DISTINCT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf
                    FROM contrato con
                    INNER JOIN cliente cli ON con.id_cliente = cli.id
                    INNER JOIN imovel imo ON con.id_imovel = imo.id
                    INNER JOIN responsavel res ON con.id_responsavel = res.id
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
            db.query(`SELECT con.id, con.id_responsavel, con.id_cliente, con.id_imovel, con.data_inicio, con.data_fim,
            con.vigencia, con.data_vencimento, con.valor_boleto, con.carencia, pdf.nome nome_pdf
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
    cadastrar: (contrato) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO contrato(id_responsavel,id_cliente,id_imovel,data_inicio,data_fim,data_vencimento,
            valor_boleto,carencia, deletado) VALUES(${contrato.id_responsavel}, ${contrato.id_cliente},${contrato.id_imovel},
            '${contrato.data_inicio}','${contrato.data_fim}','${contrato.data_vencimento}','${contrato.valor_boleto}',
            '${contrato.carencia}', 'false') RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    editar: (contrato) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE contrato SET id_responsavel = ${contrato.id_responsavel}, id_cliente = ${contrato.id_cliente},
            id_imovel = ${contrato.id_imovel}
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
            ${idContrato}, '${data_vencimento}', '${contrato.valor_boleto}', 1) 
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
            db.query(`UPDATE contrato SET deletado = ${true} WHERE id = ${idContrato} RETURNING id`, (erro,resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            } )
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
    boletos: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT bol.id, bol.data_vencimento, sta.descricao status, bol.valor, bol.data_quitacao
        FROM boleto bol
        INNER JOIN status_boleto sta ON bol.id_status_boleto = sta.id
        WHERE bol.id_contrato = ${idContrato} ORDER BY id`, (erro, resultado) => {
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
    editarBoleto: (boleto, data_vencimento) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE boleto SET data_vencimento = '${data_vencimento}', data_quitacao = '${boleto.data_quitacao}',
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
    importarPDF: (url,contrato, nome) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO pdf_contrato(url, id_contrato, nome) VALUES('${url}', ${contrato}, '${nome}') RETURNING id, nome`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    deletarPDF: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM pdf_contrato WHERE id_contrato = ${idContrato} RETURNING id, nome`,
                (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }
}
