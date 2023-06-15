const db = require("../db/conexao")
const dayjs = require("dayjs")

module.exports = {
    visualizarTodos: (todos) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf, sta_con.descricao status, con.data_inicio, 
                    con.data_fim, con.data_vencimento, ARRAY_AGG(fia.nome) fiadores, con.carencia, 
                    con.valor_boleto, pdfadt.url url_aditivo
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN pdf_contrato pdf on pdf.id_contrato = con.id
                    LEFT JOIN pdf_aditivo_contrato pdfadt on pdfadt.id_contrato = con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE deletado = 'false' ${ todos === 'false' ? "AND id_status_contrato = 1" : ""}
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, pdf.url, pdf.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto, pdfadt.url
                    ORDER BY imo.nome`,
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

    visualizarTodosNovoPadrao: (pagina, itensPorPagina, filtro) => {

        let sql = `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf, sta_con.descricao status, con.data_inicio, 
                    con.data_fim, con.data_vencimento, ARRAY_AGG(fia.nome) fiadores, con.carencia, 
                    con.valor_boleto, pdfadt.url url_aditivo
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN pdf_contrato pdf on pdf.id_contrato = con.id
                    LEFT JOIN pdf_aditivo_contrato pdfadt on pdfadt.id_contrato = con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE deletado = 'false' ${filtro ? `AND
                    ( unaccent(cli.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(imo.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(res.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(sta_con.descricao) ILIKE unaccent('%${filtro}%')
                    OR con.id::varchar(255) LIKE LOWER('%${filtro}%')) ` : ""}
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, pdf.url, pdf.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto, pdfadt.url
                    ORDER BY imo.nome
                    LIMIT ${itensPorPagina} 
                    OFFSET ${(parseInt(pagina) - 1) * parseInt(itensPorPagina)}`

        return new Promise((resolve, reject) => {
            db.query(sql,
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

    contarContratos: async (filtro) => {
        return await db.query(`
            SELECT 
                COUNT(con.id) total
            FROM contrato con
             LEFT JOIN cliente cli ON con.id_cliente = cli.id
            LEFT JOIN imovel imo ON con.id_imovel = imo.id
            LEFT JOIN responsavel res ON con.id_responsavel = res.id
            LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
            WHERE 
                con.deletado_em IS NULL AND con.deletado = 'false'
                ${filtro ? `AND
                    (unaccent(cli.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(imo.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(res.nome) ILIKE unaccent('%${filtro}%')
                    OR unaccent(sta_con.descricao) ILIKE unaccent('%${filtro}%')
                    OR con.id::varchar(255) LIKE LOWER('%${filtro}%')) ` : ""}
            `)
            .then(resp => resp.rows[0].total)
    },

    visualizar: async (idContrato) => {
        console.log(idContrato)

        let select = await db
            .query(
                `SELECT con.id, con.id_responsavel, con.id_cliente, con.id_cliente2, con.id_imovel, con.data_inicio, con.data_fim,
            con.vigencia, con.data_vencimento data_vencimento, con.valor_boleto, con.carencia, pdf.nome nome_pdf, con.observacao, con.garantia,
            con.id_status_contrato status, con.juros_multa, con.juros_mes, con.multa, con.ultimo_reajuste, con.valor_reajustado, pdfadt.nome nome_aditivo,
            con.valor_anterior_reajustado
            FROM contrato con
            LEFT OUTER JOIN pdf_contrato pdf on pdf.id_contrato = con.id
            LEFT OUTER JOIN pdf_aditivo_contrato pdfadt on pdfadt.id_contrato = con.id
            WHERE con.id = ${idContrato}`
            )
            .then((resp) => {
                console.log(resp.rows)

                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return select
    },
    fiador: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM fiador WHERE id_contrato = ${idContrato}`,
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
    cadastrar: async (contrato, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        let insert = await db
            .query(
                `INSERT INTO contrato(id_responsavel,id_cliente,id_cliente2,id_imovel,data_inicio,data_fim,data_vencimento,
            valor_boleto,carencia, deletado, id_status_contrato, criado_em, alterado_em, criado_por, alterado_por, 
            observacao, garantia, juros_multa, juros_mes, multa) 
            VALUES(
            ${contrato.id_responsavel}, ${contrato.id_cliente}, ${contrato.id_cliente2},${contrato.id_imovel},
            '${contrato.data_inicio}','${contrato.data_fim}','${contrato.data_vencimento}','${contrato.valor_boleto_convertido}',
            '${contrato.carencia}', 'false', ${contrato.status},'${agora}', '${agora}', ${idUsuario}, ${idUsuario}, 
            '${contrato.observacao}', '${contrato.garantia}', ${contrato.juros_multa}, '${contrato.juros_mes}',
            '${contrato.multa}'
            ) RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        let select = await db
            .query(
                `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, sta_con.descricao status, con.data_inicio, con.vigencia,
                    con.data_fim, con.data_vencimento, con.carencia, con.valor_boleto,ARRAY_AGG(fia.nome) fiadores
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE con.id = ${insert.id}
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {contrato: select}
    },

    cadastrarNovoPadrao: async (contrato, idUsuario) => {
        console.log(contrato)

        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        let insert = await db
            .query(
                `INSERT INTO contrato(id_responsavel,id_cliente,id_cliente2,id_imovel,data_inicio,data_fim,data_vencimento,
            valor_boleto,carencia, deletado, id_status_contrato, criado_em, alterado_em, criado_por, alterado_por, 
            observacao, garantia, juros_multa, juros_mes, multa) 
            VALUES(
            ${contrato.id_responsavel}, ${contrato.id_cliente}, ${contrato.id_cliente2},${contrato.id_imovel},
            ${contrato.data_inicio},${contrato.data_fim},${contrato.data_vencimento},${contrato.valor_boleto},
            ${contrato.carencia}, 'false', ${contrato.status},'${agora}', '${agora}', ${idUsuario}, ${idUsuario}, 
            ${contrato.observacao}, ${contrato.garantia}, ${contrato.juros_multa}, ${contrato.juros_mes},
            ${contrato.multa}
            ) RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        let select = await db
            .query(
                `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, sta_con.descricao status, con.data_inicio, con.vigencia,
                    con.data_fim, con.data_vencimento, con.carencia, con.valor_boleto,ARRAY_AGG(fia.nome) fiadores
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE con.id = ${insert.id}
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {contrato: select}
    },

    editar: async (contrato, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        await db.query(`
            UPDATE contrato SET
                id_responsavel = ${contrato.id_responsavel},
                id_cliente = ${contrato.id_cliente},
                id_cliente2 = ${contrato.id_cliente2},
                id_imovel = ${contrato.id_imovel},
                data_inicio = '${contrato.data_inicio}',
                valor_boleto = '${contrato.valor_boleto_convertido}',
                carencia = '${contrato.carencia}',
                juros_mes = '${contrato.juros_mes}',
                id_status_contrato = ${contrato.status},
                garantia = '${contrato.garantia}',
                juros_multa = ${contrato.juros_multa},
                data_vencimento = '${contrato.data_vencimento}',
                multa = '${contrato.multa}',
                alterado_em = '${agora}',
                alterado_por = ${idUsuario},
                observacao = '${contrato.observacao}'
            WHERE id = ${contrato.id} RETURNING id
        `)

        let select = await db
            .query(
                `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf, sta_con.descricao status, con.data_inicio,
                    con.data_fim, con.data_vencimento, ARRAY_AGG(fia.nome) fiadores, con.carencia,
                    con.valor_boleto, pdfadt.url url_aditivo
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN pdf_contrato pdf on pdf.id_contrato = con.id
                    LEFT JOIN pdf_aditivo_contrato pdfadt on pdfadt.id_contrato = con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE deletado = 'false' AND con.id = ${contrato.id}
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, pdf.url, pdf.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto, pdfadt.url`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {contrato: select}
    },

    atualizarBoletoContrato: async (idContrato, valor, data_vencimento) => {
        let boletos = await db.query(`SELECT id, data_vencimento FROM boleto WHERE id_contrato = ${idContrato} AND id_status_boleto = 1 ORDER BY data_vencimento`).then(resp => resp.rows)

        let mesAtualVencimento = null
        let novaDataVencimento = null

        for(let boleto of boletos){
            let dataVencimento = boleto.data_vencimento
            mesAtualVencimento = dayjs(dataVencimento).month()
            novaDataVencimento = dayjs(dataVencimento).date(data_vencimento).format("YYYY-MM-DD")
            while(dayjs(novaDataVencimento).month() !== mesAtualVencimento){
                novaDataVencimento = dayjs(novaDataVencimento).subtract(1,'day').format("YYYY-MM-DD")
            }
            await db.query(`UPDATE boleto SET data_vencimento = '${novaDataVencimento}', valor = '${valor}' WHERE id = ${boleto.id}`)
        }
    },

    gerarBoleto: (idContrato, data_vencimento, valor_boleto) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO boleto(id_contrato, data_vencimento, valor, id_status_boleto) VALUES(
            ${idContrato}, '${data_vencimento}', '${valor_boleto}', 1) 
            RETURNING id, data_vencimento`,
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
    atualizarVigencia: (idContrato, vigencia) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE contrato SET vigencia = ${vigencia}
            WHERE id = ${idContrato} RETURNING id`,
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

    atualizarImovelAlugado: (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`
        UPDATE imovel SET id_status_imovel = 1 WHERE id = ${idImovel}
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

    deletar: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM contrato WHERE id = ${idContrato}`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado)
                }
            )
        })
    },
    deletarContrato: async (idContrato, id_usuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        try{
            let {id_cliente, id_imovel, id_cliente2} = await db.query(`
                SELECT id_cliente, id_imovel, id_cliente2 FROM contrato WHERE id = ${idContrato} LIMIT 1
            `).then(resp => resp.rows[0])

            await db.query(`UPDATE imovel SET id_status_imovel = 3, alterado_em = '${agora}', alterado_por = ${ id_usuario } WHERE id = ${id_imovel}`)

            await db.query(`UPDATE cliente SET id_status_cliente = 2, alterado_em = '${agora}', alterado_por = ${ id_usuario } WHERE id = ${id_cliente} OR id = ${id_cliente2}`)

            await db.query(`UPDATE contrato SET deletado = ${true}, alterado_em = '${agora}', alterado_por = ${ id_usuario } WHERE id = ${idContrato}`)

            return { falha: false, dados: { contrato: idContrato } }
        }catch(error){
            console.log(error)
            return { falha: true, erro: error}
        }
    },
    status: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT id, descricao FROM status_contrato ORDER BY descricao`,
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
            db.query(
                `DELETE FROM boleto WHERE id_contrato = ${idContrato}`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado)
                }
            )
        })
    },
    responsaveis: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT id,nome FROM responsavel ORDER BY nome`,
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
    clientes: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT id,nome FROM cliente ORDER BY nome`,
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
    imoveis: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT id,nome FROM imovel ORDER BY nome`,
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
    idFiador: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT id,descricao FROM id_fiador ORDER BY descricao`,
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
    boletos: async (idContrato) => {
        let select = await db
            .query(
                `SELECT bol.id, bol.data_vencimento, sta.descricao status, bol.id_status_boleto, bol.valor, bol.data_quitacao, bol.valor_juros
        FROM boleto bol
        INNER JOIN status_boleto sta ON bol.id_status_boleto = sta.id
        WHERE bol.id_contrato = ${idContrato} ORDER BY data_vencimento`
            )
            .then((resp) => {
                return resp.rows
            })
            .catch((e) => {
                console.log(e)
            })

        return select
    },
    boleto: (idBoleto) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT bol.id, bol.data_vencimento, bol.id_status_boleto, bol.valor, bol.data_quitacao, 
            bol.valor_juros, con.juros_multa
            FROM boleto bol
            INNER JOIN contrato con ON bol.id_contrato = con.id
            WHERE bol.id = ${idBoleto}`,
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
    statusBoleto: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM status_boleto ORDER BY descricao`,
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
    editarBoleto: async (boleto, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        let update = await db
            .query(
                `UPDATE boleto SET data_vencimento = '${boleto.data_vencimento}', data_quitacao = '${boleto.data_quitacao}',
            valor = '${boleto.valor}', id_status_boleto = ${boleto.id_status_boleto}, alterado_em = '${agora}', 
            alterado_por = ${idUsuario} WHERE id = ${boleto.id} 
            RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        let select = await db
            .query(
                `
            SELECT bol.id, bol.data_vencimento, sta.descricao status, bol.id_status_boleto, bol.valor, bol.data_quitacao, bol.valor_juros
            FROM boleto bol
            INNER JOIN status_boleto sta ON bol.id_status_boleto = sta.id WHERE bol.id = ${update.id} 
            `
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {boleto: select}
    },
    cadastrarBoleto: async (boleto, idContrato, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        let insert = await db
            .query(
                `INSERT INTO boleto
            (id_contrato, data_vencimento, data_quitacao, valor, id_status_boleto, criado_em, alterado_em, criado_por, 
            alterado_por) 
            VALUES 
            (${idContrato}, '${boleto.data_vencimento}', '${boleto.data_quitacao}', '${boleto.valor}', ${boleto.id_status_boleto},
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}) 
            RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        let select = await db
            .query(
                `
            SELECT bol.id, bol.data_vencimento, sta.descricao status, bol.id_status_boleto, bol.valor, bol.data_quitacao, bol.valor_juros
            FROM boleto bol
            INNER JOIN status_boleto sta ON bol.id_status_boleto = sta.id WHERE bol.id = ${insert.id}
            `
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {boleto: select}
    },
    deletarBoleto: async (idBoleto) => {
        let deletado = await db
            .query(`DELETE FROM boleto WHERE id = ${idBoleto} RETURNING id`)
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        return {boleto: deletado}
    },
    importarPDF: (url, contrato, nome) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO pdf_contrato(url, id_contrato, nome) VALUES('${url}', ${contrato}, '${nome}') RETURNING id, nome, url`,
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
    deletarPDF: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM pdf_contrato WHERE id_contrato = ${idContrato} RETURNING id, nome, url`,
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
    importarAditivo: (url, contrato, nome) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO pdf_aditivo_contrato(url, id_contrato, nome) VALUES('${url}', ${contrato}, '${nome}') RETURNING id, nome, url`,
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
    deletarAditivo: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM pdf_aditivo_contrato WHERE id_contrato = ${idContrato} RETURNING id, nome, url`,
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

    cadastrarFiador: async (fiador, idContrato, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        console.log(fiador)

        let insert = await db
            .query(
                `INSERT INTO fiador(nome, id_estado_civil, data_nascimento,email,cpf_cnpj, identidade, cep, rua,
            numero, complemento, bairro, cidade, estado, id_contrato, telefone, criado_em, alterado_em, criado_por,
            alterado_por)
          VALUES(
              '${fiador.nome}', ${fiador.estado_civil}, '${fiador.data_nascimento}', '${fiador.email}', '${fiador.cpf_cnpj}',
              '${fiador.identidade}', '${fiador.cep}', '${fiador.rua}','${fiador.numero}', '${fiador.complemento}',
              '${fiador.bairro}', '${fiador.cidade}', '${fiador.estado}', ${idContrato}, '${fiador.telefone}',
              '${agora}', '${agora}', ${idUsuario}, ${idUsuario})
          RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        let select = await db
            .query(`SELECT * From fiador WHERE id = ${insert.id}`)
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {fiador: select}
    },
    fiadores: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * From fiador WHERE id_contrato = ${idContrato}`,
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
    editarFiador: async (fiador, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss")

        let update = await db
            .query(
                `UPDATE fiador SET nome = '${fiador.nome}', rua = '${fiador.rua}', bairro = '${fiador.bairro}',
          cidade = '${fiador.cidade}', estado = '${fiador.estado}', complemento = '${fiador.complemento}',
          email = '${fiador.email}', id_estado_civil = ${fiador.id_estado_civil}, cpf_cnpj = '${fiador.cpf_cnpj}',
          identidade = '${fiador.identidade}', data_nascimento = '${fiador.data_nascimento}', cep = '${fiador.cep}',
          telefone = '${fiador.telefone}', alterado_em = '${agora}', alterado_por = ${idUsuario}
          WHERE id = ${fiador.id} RETURNING id`
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })
        console.log(update)

        let select = await db
            .query(
                `
            SELECT * From fiador WHERE id = ${update.id}
        `
            )
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
            })

        return {fiador: select}
    },
    deletarFiador: async (idFiador) => {
        let deletado = await db
            .query(`DELETE FROM fiador WHERE id = ${idFiador} RETURNING id`)
            .then((resp) => {
                return resp.rows[0]
            })
            .catch((e) => {
                console.log(e)
                return Promise.reject(e)
            })

        return {fiador: deletado}
    },

    aplicarReajuste: (reajuste, idContrato, dataHoje, valor_anterior) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE contrato SET valor_reajustado = '${reajuste}', ultimo_reajuste = '${dataHoje}', valor_anterior_reajustado='${valor_anterior}' 
            WHERE id = ${idContrato} RETURNING ultimo_reajuste`,
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

    contratosParaReajustar: (anoPassado) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT con.id, con.data_inicio, cli.nome cliente_nome, imo.nome imovel_nome,
            COALESCE(con.ultimo_reajuste, con.data_inicio) AS ultimo_reajuste
            FROM contrato con
            INNER JOIN cliente cli ON cli.id = con.id_cliente
            INNER JOIN imovel imo ON imo.id = con.id_imovel
            WHERE con.id_status_contrato = 1 AND con.data_inicio < '${anoPassado}' AND COALESCE(con.ultimo_reajuste, con.data_inicio) < '${anoPassado}' AND deletado = 'false'
            ORDER BY ultimo_reajuste DESC`,
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
                `SELECT con.id,cli.nome nome_cliente,imo.nome nome_imovel,
                    res.nome nome_responsavel, pdf.url, pdf.nome nome_pdf, sta_con.descricao status, con.data_inicio, 
                    con.data_fim, con.data_vencimento, ARRAY_AGG(fia.nome) fiadores, con.carencia, 
                    con.valor_boleto, pdfadt.url url_aditivo
                    FROM contrato con
                    LEFT JOIN cliente cli ON con.id_cliente = cli.id
                    LEFT JOIN imovel imo ON con.id_imovel = imo.id
                    LEFT JOIN responsavel res ON con.id_responsavel = res.id
                    LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
                    LEFT JOIN pdf_contrato pdf on pdf.id_contrato = con.id
                    LEFT JOIN pdf_aditivo_contrato pdfadt on pdfadt.id_contrato = con.id
                    LEFT JOIN fiador fia ON fia.id_contrato = con.id
                    WHERE deletado = 'false' AND
                    LOWER(cli.nome) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.nome) LIKE LOWER('%${busca}%')
                    OR LOWER(res.nome) LIKE LOWER('%${busca}%')
                    OR LOWER(res.nome) LIKE LOWER('%${busca}%')
                    OR LOWER(sta_con.descricao) LIKE LOWER('%${busca}%')
                    OR LOWER(sta_con.descricao) LIKE LOWER('%${busca}%')
                    OR con.id::varchar(255) LIKE LOWER('%${busca}%') 
                    GROUP BY con.id, cli.nome, imo.nome, res.nome, pdf.url, pdf.nome, sta_con.descricao, con.data_inicio,
                    con.data_fim, con.data_vencimento, con.carencia,con.valor_boleto, pdfadt.url
                    ORDER BY imo.nome
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
