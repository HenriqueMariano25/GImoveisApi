const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    cadastrar: (imovel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO imovel(
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
                ) RETURNING id, nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT imo.id, imo.nome, imo.id_responsavel, imo.inscricao_municipal, imo.funesbom, 
            imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,imo.cep, imo.rua,imo.numero, imo.complemento, 
            imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao, imo.met_quadrada area, 
            imo.met_quadrada_construida area_construida, imo.valor_atual, imo.valor_aquisicao,
            imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua, imo.data_venda,
            ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) descricao,
            ARRAY_AGG(com.id_tipo_comodo)
            FROM comodo com
            FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
            LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
            LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
            GROUP BY imo.nome, imo.rua, imo.id,sta_imo.descricao
                                ORDER BY imo.nome`, (erro, resultado) => {
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
                return resolve(resultado.rows)
            })
        })
    },

    editarImovel: (id, imovel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss ')
        return new Promise((resolve, reject) => {
            db.query(`UPDATE imovel SET nome = '${imovel.nome.trim()}', rua = '${imovel.rua}', bairro = '${imovel.bairro}',
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
             WHERE id = ${id} RETURNING nome, id, data_venda`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarImovel: idImovel => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM imovel WHERE id = ${idImovel} RETURNING id, nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
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

    deletarComodo: idComodo => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM comodo WHERE id = ${idComodo} RETURNING id`, (erro, resultado) => {
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
    // cadastrarComodo: (idImovel, quantidadeComodo, tipoComodo) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`INSERT INTO comodo(
    //         id_imovel,quantidade,id_tipo_comodo
    //         ) VALUES (
    //         ${idImovel}, ${quantidadeComodo},${tipoComodo}
    //         ) RETURNING id`, (erro, resultado) => {
    //             if (erro) {
    //                 console.log(erro)
    //                 return reject(erro)
    //             }
    //             return resolve(resultado.rows)
    //         })
    //     })
    // },
    cadastrarComodo: (idImovel, comodo) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO comodo(  
            id_imovel,quantidade,id_tipo_comodo, descricao
            ) VALUES(
            ${idImovel}, ${comodo.quantidade}, ${comodo.id_tipo_comodo}, '${comodo.descricao}'
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editarComodo: (comodo) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE comodo
            SET quantidade = ${comodo.quantidade}, id_tipo_comodo = ${comodo.id_tipo_comodo}, descricao = '${comodo.descricao}'
            WHERE id = ${comodo.id}`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
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

    cadastrarDespesa: (despesa, idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO despesa(valor, data,data_vencimento, id_tipo_despesa, fixa_variavel, descricao, id_imovel) 
            VALUES 
            ('${despesa.valor}', '${despesa.data}', '${despesa.data_vencimento}', ${despesa.tipo_despesa},
            '${despesa.fixa_variavel}', '${despesa.descricao.trim()}', ${idImovel})`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    despesas: (idImovel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT des.id, des.descricao, des.data,data_vencimento, des.valor, tip_des.descricao descricao_tipo_despesa,
             des.fixa_variavel, des.id_tipo_despesa
                FROM despesa des
                LEFT JOIN tipo_despesa tip_des ON des.id_tipo_despesa = tip_des.id
                WHERE id_imovel = ${idImovel} ORDER BY data, data_vencimento`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editarDespesa: (despesa) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE despesa SET descricao = '${despesa.descricao.trim()}', data = '${despesa.data}',
             data_vencimento = '${despesa.data_vencimento}', valor = '${despesa.valor}', id_tipo_despesa = ${despesa.tipo_despesa} ,
             fixa_variavel = '${despesa.fixa_variavel}' WHERE id = ${despesa.id}`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarDespesa: (idDespesa) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM despesa WHERE id = ${idDespesa} RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
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
    }
}
