const db = require('../db/conexao')

module.exports = {
    cadastrar: imovel => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO imovel(
                nome, rua , cep, bairro,cidade,estado,complemento,met_quadrada,met_quadrada_construida, inscricao_municipal, 
                funesbom, num_cliente_luz,num_cliente_agua, valor_aquisicao, valor_venda,data_aquisicao, data_venda, 
                valor_atual, id_status_imovel, id_tipo_imovel, proprietario, numero, valor_aquisicao_dolar
                ) VALUES (
                '${imovel.nome}', '${imovel.rua}', '${imovel.cep}', '${imovel.bairro}', '${imovel.cidade}','${imovel.estado}', 
                '${imovel.complemento}','${imovel.area}', '${imovel.area_construida}', '${imovel.inscricao_municipal}',
                '${imovel.funesbom}', '${imovel.numero_cliente_luz}', '${imovel.numero_cliente_agua}', '${imovel.valor_aquisicao}',
                '${imovel.valor_atual}', '${imovel.data_aquisicao}', '${imovel.data_venda}', '${imovel.valor_atual}', 
                ${imovel.id_status}, ${imovel.tipo_imovel}, '${imovel.proprietario}', '${imovel.numero}', '${imovel.valor_aquisicao_dolar}'
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
            db.query(`SELECT imo.id, imo.nome, imo.proprietario, imo.inscricao_municipal, imo.funesbom, 
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
            db.query(`SELECT imo.id,imo.nome, imo.proprietario, imo.inscricao_municipal, imo.funesbom, 
                    imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel id_status ,sta_imo.descricao status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    imo.met_quadrada area, imo.met_quadrada_construida area_construida, imo.valor_atual, 
                    imo.valor_aquisicao,imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua,
                    imo.data_venda,ARRAY_AGG(com.quantidade) quantidade, ARRAY_AGG(tip_com.descricao) descricao,
                    ARRAY_AGG(com.id_tipo_comodo) tipo_comodo, ARRAY_AGG(com.id) id_comodo, valor_aquisicao_dolar
                    FROM comodo com
                    FULL OUTER JOIN imovel imo ON imo.id = com.id_imovel
                    LEFT OUTER JOIN tipo_comodo tip_com ON com.id_tipo_comodo = tip_com.id
                    LEFT OUTER JOIN status_imovel sta_imo ON imo.id_status_imovel = sta_imo.id
                    WHERE imo.id = ${id}
                    GROUP BY imo.id, imo.nome, imo.proprietario, imo.inscricao_municipal, imo.funesbom, 
                    tipo_imovel,id_status ,status,
                    imo.cep, imo.rua,imo.numero, imo.complemento, imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao,
                    area,area_construida, imo.valor_atual, imo.valor_aquisicao,numero_cliente_luz,numero_cliente_agua,
                    imo.data_venda,valor_aquisicao_dolar
            `, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editarImovel: (id, imovel) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE imovel SET nome = '${imovel.nome}', rua = '${imovel.rua}', bairro = '${imovel.bairro}',
             estado = '${imovel.estado}', complemento = '${imovel.complemento}', met_quadrada = '${imovel.area}',
             met_quadrada_construida = '${imovel.area_construida}', inscricao_municipal = '${imovel.inscricao_municipal}',
             funesbom = '${imovel.funesbom}', num_cliente_luz = '${imovel.numero_cliente_luz}',
             num_cliente_agua = '${imovel.numero_cliente_agua}', valor_aquisicao = '${imovel.valor_aquisicao}',
             valor_venda = '${imovel.valor_atua}', data_aquisicao = '${imovel.data_aquisicao}', 
             data_venda = '${imovel.data_venda}',valor_atual = '${imovel.valor_atual}', 
             id_status_imovel = ${imovel.id_status}, id_tipo_imovel = '${imovel.tipo_imovel}',
             proprietario = '${imovel.proprietario}', numero = '${imovel.numero}', cidade = '${imovel.cidade}', 
             cep = '${imovel.cep}' , valor_aquisicao_dolar = '${imovel.valor_aquisicao_dolar}'
             WHERE id = ${id} RETURNING nome, id, data_venda` , (erro, resultado) => {
                if(erro){
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
            db.query(`DELETE FROM comodo WHERE id_imovel = ${idImovel} RETURNING id` , (erro,resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarComodo: idComodo => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM comodo WHERE id = ${idComodo} RETURNING id` , (erro,resultado) => {
                if(erro){
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
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    cadastrarComodo: (idImovel, quantidadeComodo, tipoComodo) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO comodo(  
            id_imovel,quantidade,id_tipo_comodo
            ) VALUES (
            ${idImovel}, ${quantidadeComodo},${tipoComodo}
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    editarComodo:(comodo) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE comodo
            SET quantidade = ${comodo.quantidade}, id_tipo_comodo = ${comodo.tipo}
            WHERE id = ${comodo.id}`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
}
