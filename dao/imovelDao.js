const db = require('../db/conexao')

module.exports = {
    cadastrar: imovel => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO imovel(
                nome, rua , cep, bairro,cidade,estado,complemento,met_quadrada,met_quadrada_construida, inscricao_municipal, 
                funesbom, num_cliente_luz,num_cliente_agua, valor_aquisicao, valor_venda,data_aquisicao, data_venda, 
                valor_atual, id_status_imovel, id_tipo_imovel, proprietario, numero
                ) VALUES (
                '${imovel.nome}', '${imovel.rua}', '${imovel.cep}', '${imovel.bairro}', '${imovel.cidade}','${imovel.estado}', 
                '${imovel.complemento}','${imovel.area}', '${imovel.area_construida}', '${imovel.inscricao_municipal}',
                '${imovel.funesbom}', '${imovel.numero_cliente_luz}', '${imovel.numero_cliente_agua}', '${imovel.valor_aquisicao}',
                '${imovel.valor_atual}', '${imovel.data_aquisicao}', '${imovel.data_venda}', '${imovel.valor_atual}', 
                ${imovel.status}, ${imovel.tipo_imovel}, '${imovel.proprietario}', '${imovel.numero}'
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
            db.query(`SELECT imo.nome, imo.rua, imo.id FROM imovel imo ORDER BY imo.nome`, (erro, resultado) => {
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
            db.query(`SELECT imo.id, imo.nome, imo.proprietario, imo.inscricao_municipal, imo.funesbom, 
            imo.id_tipo_imovel tipo_imovel,imo.id_status_imovel status ,imo.cep, imo.rua,imo.numero, imo.complemento, 
            imo.bairro, imo.cidade, imo.estado,imo.data_aquisicao, imo.met_quadrada area, 
            imo.met_quadrada_construida area_construida, imo.valor_atual, imo.valor_aquisicao,
             imo.num_cliente_luz numero_cliente_luz, imo.num_cliente_agua numero_cliente_agua, imo.data_venda
            FROM imovel imo WHERE id = ${id}`, (erro, resultado) => {
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

    status: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM status_imovel ORDER BY descricao`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                console.log(resultado.rows)
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

    editarImovel: (id, imovel) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE imovel SET nome = '${imovel.nome}', rua = '${imovel.rua}', bairro = '${imovel.bairro}',
             estado = '${imovel.estado}', complemento = '${imovel.complemento}', met_quadrada = '${imovel.area}',
             met_quadrada_construida = '${imovel.area_construida}', inscricao_municipal = '${imovel.inscricao_municipal}',
             funesbom = '${imovel.funesbom}', num_cliente_luz = '${imovel.numero_cliente_luz}',
             num_cliente_agua = '${imovel.numero_cliente_agua}', valor_aquisicao = '${imovel.valor_aquisicao}',
             valor_venda = '${imovel.valor_atua}', data_aquisicao = '${imovel.data_aquisicao}', data_venda = '${imovel.data_venda}',
             valor_atual = '${imovel.valor_atual}', id_status_imovel = ${imovel.status}, id_tipo_imovel = '${imovel.tipo_imovel}',
             proprietario = '${imovel.proprietario}', numero = '${imovel.numero}', cidade = '${imovel.cidade}', cep = ${imovel.cep} 
             WHERE id = ${id} RETURNING nome, id, data_venda` , (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }
}