const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    cadastrar: async (imovel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let insert = await db.query(`INSERT INTO imovel(
                nome, rua , cep, bairro,cidade,estado,complemento,met_quadrada,met_quadrada_construida, inscricao_municipal, 
                funesbom, num_cliente_luz,num_cliente_agua, valor_aquisicao, valor_venda,data_aquisicao, data_venda, 
                valor_atual, id_status_imovel, id_tipo_imovel, id_responsavel, numero, valor_aquisicao_dolar, criado_em, alterado_em,
                criado_por, alterado_por, observacao
                ) VALUES (
                '${imovel.nome.trim()}', '${imovel.rua}', '${imovel.cep}', '${imovel.bairro}', '${imovel.cidade}','${imovel.estado}', 
                '${imovel.complemento}','${imovel.area}', '${imovel.area_construida}', '${imovel.inscricao_municipal}',
                '${imovel.funesbom}', '${imovel.numero_cliente_luz}', '${imovel.numero_cliente_agua}', '${imovel.valor_aquisicao}',
                '${imovel.valor_atual}', '${imovel.data_aquisicao}', '${imovel.data_venda}', '${imovel.valor_atual}', 
                ${imovel.id_status}, ${imovel.tipo_imovel}, ${imovel.id_responsavel}, '${imovel.numero}', '${imovel.valor_aquisicao_dolar}',
                '${agora}', '${agora}', ${idUsuario}, ${idUsuario}, '${imovel.observacao}'
                ) RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT imo.id,imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom,
                    imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    imo.met_quadrada area, imo.met_quadrada_construida area_construida, imo.valor_atual,
                    imo.valor_aquisicao,imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua,
                    imo.data_venda,ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) descricao, imo.observacao,
                    ARRAY_AGG(com.id_tipo_comodo) tipo_comodo, ARRAY_AGG(com.id) id_comodo, valor_aquisicao_dolar
                    FROM comodo com
                    FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
                    LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
                    LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    WHERE imo.id = ${insert.id}
                    GROUP BY imo.id, imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom,
                    tipo_imovel,id_status ,status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    area,area_construida, imo.valor_atual, imo.valor_aquisicao,numero_cliente_luz,numero_cliente_agua,
                    imo.data_venda,valor_aquisicao_dolar, imo.observacao
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {imovel: select}

    },

    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id, imo.nome, imo.rua, sta_imo.descricao status, res.nome proprietario, 
                    imo.rua, imo.numero, imo.bairro, imo.cidade,imo.cep, tip_imo.descricao tipo_imovel,
                    imo.inscricao_municipal, imo.funesbom, imo.complemento, imo.estado
                    FROM imovel imo
                    LEFT JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    LEFT JOIN responsavel res ON imo.id_responsavel = res.id
                    LEFT JOIN tipo_imovel tip_imo ON imo.id_tipo_imovel = tip_imo.id
                    ORDER BY imo.nome`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    visualizarTodosNovoPadrao: (pagina, itensPorPagina, filtro) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id, imo.nome, imo.rua, sta_imo.descricao status, res.nome proprietario, 
                    imo.rua, imo.numero, imo.bairro, imo.cidade,imo.cep, tip_imo.descricao tipo_imovel,
                    imo.inscricao_municipal, imo.funesbom, imo.complemento, imo.estado
                    FROM imovel imo
                    LEFT JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    LEFT JOIN responsavel res ON imo.id_responsavel = res.id
                    LEFT JOIN tipo_imovel tip_imo ON imo.id_tipo_imovel = tip_imo.id
                    WHERE imo.deletado_em IS NULL ${filtro ? `AND ${filtro}` : ""}
                    ORDER BY imo.nome
                    LIMIT ${itensPorPagina} 
                    OFFSET ${(parseInt(pagina) - 1) * parseInt(itensPorPagina)}`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    contarImoveis: async (filtro) => {
        return await db.query(`SELECT COUNT(id) total FROM imovel WHERE deletado_em IS NULL ${filtro ? `AND ${filtro}` : ""}`).then(resp => resp.rows[0].total)
    },

    visualizarBusca: (busca) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id, imo.nome, imo.rua, sta_imo.descricao status, res.nome proprietario, 
                    imo.rua, imo.numero, imo.bairro, imo.cidade,imo.cep, tip_imo.descricao tipo_imovel,
                    imo.inscricao_municipal, imo.funesbom, imo.complemento, imo.estado
                    FROM imovel imo
                    LEFT JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    LEFT JOIN responsavel res ON imo.id_responsavel = res.id
                    LEFT JOIN tipo_imovel tip_imo ON imo.id_tipo_imovel = tip_imo.id
                    WHERE LOWER(imo.nome) LIKE LOWER('%${busca}%') 
                    OR LOWER(sta_imo.descricao) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.rua) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.numero) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.bairro) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.cidade) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.cep) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.estado) LIKE LOWER('%${busca}%')
                    OR LOWER(tip_imo.descricao) LIKE LOWER('%${busca}%')
                    OR LOWER(imo.complemento) LIKE LOWER('%${busca}%')
                    OR LOWER(res.nome) LIKE LOWER('%${busca}%')
                    ORDER BY imo.nome`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    visualizarSimples: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id, imo.nome
                    FROM imovel imo
                    ORDER BY imo.nome`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    visualizar: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id,imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom, 
                    imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    imo.met_quadrada area, imo.met_quadrada_construida area_construida, imo.valor_atual, 
                    imo.valor_aquisicao,imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua,
                    imo.data_venda,ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) descricao, imo.observacao,
                    ARRAY_AGG(com.id_tipo_comodo) tipo_comodo, ARRAY_AGG(com.id) id_comodo, valor_aquisicao_dolar
                    FROM comodo com
                    FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
                    LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
                    LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    WHERE imo.id = ${id}
                    GROUP BY imo.id, imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom, 
                    tipo_imovel,id_status ,status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    area,area_construida, imo.valor_atual, imo.valor_aquisicao,numero_cliente_luz,numero_cliente_agua,
                    imo.data_venda,valor_aquisicao_dolar, imo.observacao
            `, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows[0])
            })
        })
    },

    visualizarNovoPadrao: async (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id,imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom, 
                    imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    imo.met_quadrada area, imo.met_quadrada_construida area_construida, imo.valor_atual, 
                    imo.valor_aquisicao,imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua,
                    imo.data_venda,ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) tipo_comodo, imo.observacao,
                    ARRAY_AGG(com.id_tipo_comodo) id_tipo_comodo, ARRAY_AGG(com.id) id_comodo, ARRAY_AGG(com.descricao) descricao, valor_aquisicao_dolar
                    FROM comodo com
                    FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
                    LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
                    LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    WHERE imo.id = ${idImovel}
                    GROUP BY imo.id, imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom, 
                    tipo_imovel,id_status ,status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    area,area_construida, imo.valor_atual, imo.valor_aquisicao,numero_cliente_luz,numero_cliente_agua,
                    imo.data_venda,valor_aquisicao_dolar, imo.observacao
            `, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows[0])
            })
        })
    },

    editarImovel: async (id, imovel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss ')

        let update = await db.query(`UPDATE imovel SET nome = '${imovel.nome.trim()}', rua = '${imovel.rua}', bairro = '${imovel.bairro}',
             estado = '${imovel.estado}', complemento = '${imovel.complemento.trim()}', met_quadrada = '${imovel.area}',
             met_quadrada_construida = '${imovel.area_construida}', inscricao_municipal = '${imovel.inscricao_municipal}',
             funesbom = '${imovel.funesbom}', num_cliente_luz = '${imovel.numero_cliente_luz}',
             num_cliente_agua = '${imovel.numero_cliente_agua}', valor_aquisicao = '${imovel.valor_aquisicao}',
             valor_venda = '${imovel.valor_atua}', data_aquisicao = '${imovel.data_aquisicao}', 
             data_venda = '${imovel.data_venda}',valor_atual = '${imovel.valor_atual}', 
             id_status_imovel = ${imovel.id_status}, id_tipo_imovel = '${imovel.tipo_imovel}',
             id_responsavel = ${imovel.id_responsavel}, numero = '${imovel.numero}', cidade = '${imovel.cidade}', 
             cep = '${imovel.cep}' , valor_aquisicao_dolar = '${imovel.valor_aquisicao_dolar}',
             alterado_em = '${agora}', alterado_por = ${idUsuario}, observacao = '${imovel.observacao}'
             WHERE id = ${id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT imo.id,imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom,
                    imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    imo.met_quadrada area, imo.met_quadrada_construida area_construida, imo.valor_atual,
                    imo.valor_aquisicao,imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua,
                    imo.data_venda,ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) descricao, imo.observacao,
                    ARRAY_AGG(com.id_tipo_comodo) tipo_comodo, ARRAY_AGG(com.id) id_comodo, valor_aquisicao_dolar
                    FROM comodo com
                    FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
                    LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
                    LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    WHERE imo.id = ${update.id}
                    GROUP BY imo.id, imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom,
                    tipo_imovel,id_status ,status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    area,area_construida, imo.valor_atual, imo.valor_aquisicao,numero_cliente_luz,numero_cliente_agua,
                    imo.data_venda,valor_aquisicao_dolar, imo.observacao
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {imovel: select}
    },

    deletarImovel: async idImovel => {
        let deletado = await db.query(`DELETE FROM imovel WHERE id = ${idImovel} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        return {responsavel: deletado}
    },

    deletarComodosImovel: idImovel => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM comodo WHERE id_imovel = ${idImovel} RETURNING id`, (erro, resultado) => {
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
            db.query(`SELECT * FROM status_imovel ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    tiposImoveis: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tipo_imovel ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    tiposComodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tipo_comodo ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    comodos: (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT com.id, com.descricao, com.id_tipo_comodo, tip_com.descricao tipo_comodo, com.quantidade
              FROM comodo com
              LEFT JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
              WHERE id_imovel = ${idImovel} ORDER BY tipo_comodo`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    cadastrarComodo: async (idImovel, comodo, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let insert = await db.query(`INSERT INTO comodo(  
            id_imovel,quantidade,id_tipo_comodo, descricao, criado_em, alterado_em, criado_por, alterado_por
            ) VALUES(
            ${idImovel}, ${comodo.quantidade}, ${comodo.id_tipo_comodo}, '${comodo.descricao}',
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}
            ) RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT com.id, com.descricao, com.id_tipo_comodo, tip_com.descricao tipo_comodo, com.quantidade
              FROM comodo com
              LEFT JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
              WHERE com.id = ${insert.id} ORDER BY tipo_comodo`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {comodo: select}
    },

    editarComodo: async (comodo, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let update = await db.query(`UPDATE comodo
            SET quantidade = ${comodo.quantidade}, id_tipo_comodo = ${comodo.id_tipo_comodo}, descricao = ${ comodo.descricao ? "'"+comodo.descricao+"'" : null }
            , alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${comodo.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT com.id, com.descricao, com.id_tipo_comodo, tip_com.descricao tipo_comodo, com.quantidade
              FROM comodo com
              LEFT JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
              WHERE com.id = ${update.id} ORDER BY tipo_comodo`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {comodo: select}
    },

    deletarComodo: async idComodo => {
        let deletado = await db.query(`DELETE FROM comodo WHERE id = ${idComodo} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {comodo: deletado}
    },

    deletarComodoNovoPadrao: async ( idComodo, idUsuario ) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

        let resp = await db
            .query(
                `UPDATE comodo SET deletado_por = ${idUsuario}, deletado_em = '${agora}' WHERE id = ${idComodo}`
            )
            .then((resultado) => {
                return {falha: false, dados: {resultado: resultado.rows}};
            })
            .catch((erro) => {
                return {falha: true, erro};
            });

        return resp;
    },


    contratos: (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id contrato, cli.nome cliente, con.data_inicio, con.data_fim, sta_con.descricao status,
            pdf.nome nome_pdf
            FROM contrato con
            LEFT JOIN cliente cli ON con.id_cliente = cli.id
            LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
            LEFT JOIN pdf_contrato pdf ON pdf.id_contrato = con.id
            WHERE id_imovel = ${idImovel} AND deletado = 'false'`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    tiposDespesas: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT tip_des.id, tip_des.descricao FROM tipo_despesa tip_des ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    cadastrarDespesa: async (despesa, idImovel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let insert = await db.query(`INSERT INTO despesa(valor, data,data_vencimento, id_tipo_despesa, fixa_variavel, descricao, id_imovel, 
            id_responsavel_pagamento, criado_em, alterado_em, criado_por, alterado_por) 
            VALUES 
            ('${despesa.valor}', '${despesa.data}', '${despesa.data_vencimento}', ${despesa.id_tipo_despesa},
            '${despesa.fixa_variavel}', '${despesa.descricao.trim()}', ${idImovel}, ${despesa.id_responsavel_pagamento},
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}) RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT des.id, des.descricao, des.data,data_vencimento, des.valor, tip_des.descricao descricao_tipo_despesa,
             des.fixa_variavel, des.id_tipo_despesa, res_pag.descricao responsavel_pagamento, des.id_responsavel_pagamento
                FROM despesa des
                LEFT JOIN tipo_despesa tip_des ON des.id_tipo_despesa = tip_des.id
                LEFT JOIN responsavel_pagamento res_pag ON des.id_responsavel_pagamento = res_pag.id
                WHERE des.id = ${insert.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {despesa: select}
    },

    despesas: (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT des.id, des.descricao, des.data,data_vencimento, des.valor, tip_des.descricao descricao_tipo_despesa,
             des.fixa_variavel, des.id_tipo_despesa, res_pag.descricao responsavel_pagamento, des.id_responsavel_pagamento
                FROM despesa des
                LEFT JOIN tipo_despesa tip_des ON des.id_tipo_despesa = tip_des.id
                LEFT JOIN responsavel_pagamento res_pag ON des.id_responsavel_pagamento = res_pag.id
                WHERE id_imovel = ${idImovel} ORDER BY data, data_vencimento`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editarDespesa: async (despesa, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        console.log(despesa)


        let update = await db.query(`UPDATE despesa SET descricao = '${despesa.descricao.trim()}', data = '${despesa.data}',
             data_vencimento = '${despesa.data_vencimento}', valor = '${despesa.valor}', id_tipo_despesa = ${despesa.id_tipo_despesa} ,
             fixa_variavel = '${despesa.fixa_variavel}', id_responsavel_pagamento = ${despesa.id_responsavel_pagamento}
             , alterado_em = '${agora}', alterado_por = ${idUsuario} 
             WHERE id = ${despesa.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        let select = await db.query(`SELECT des.id, des.descricao, des.data,data_vencimento, des.valor, tip_des.descricao descricao_tipo_despesa,
             des.fixa_variavel, des.id_tipo_despesa, res_pag.descricao responsavel_pagamento, des.id_responsavel_pagamento
                FROM despesa des
                LEFT JOIN tipo_despesa tip_des ON des.id_tipo_despesa = tip_des.id
                LEFT JOIN responsavel_pagamento res_pag ON des.id_responsavel_pagamento = res_pag.id
                WHERE des.id = ${update.id}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {despesa: select}
    },

    deletarDespesa: async (idDespesa) => {
        let deletado = await db.query(`DELETE FROM despesa WHERE id = ${idDespesa} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {despesa: deletado}
    },

    proprietarios: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, nome FROM responsavel ORDER BY nome`,
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

    responsaveisPagameneto: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM responsavel_pagamento ORDER BY descricao`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                }
            )
        })
    }
}
