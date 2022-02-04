const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    cadastrar: async (responsavel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let insert = await db.query(`INSERT INTO responsavel(nome, data_nascimento, cpf_cnpj, identidade, id_estado_civil,cep,rua,
                    numero,bairro,cidade,estado, complemento, criado_em, alterado_em, criado_por, alterado_por) 
                    VALUES ('${responsavel.nome.trim()}','${responsavel.data_nascimento}','${responsavel.cpf_cnpj}',
                    '${responsavel.identidade}',${responsavel.id_estado_civil},'${responsavel.cep}','${responsavel.rua}',
                    '${responsavel.numero}','${responsavel.bairro}','${responsavel.cidade}','${responsavel.estado}',
                    '${responsavel.complemento}', '${agora}', '${agora}', ${idUsuario}, ${idUsuario})
                    RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT res.nome, res.id,res.cep ,res.data_nascimento, res.id_estado_civil, res.cpf_cnpj, res.identidade,
                    res.rua, res.bairro, res.numero, res.cidade, res.complemento, res.estado
                    FROM responsavel res WHERE res.id = ${insert.id} 
                    ORDER BY res.nome
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {responsavel: select}

    },
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT res.nome, res.id, res.cpf_cnpj, res.rua, res.numero, res.cidade, res.bairro, res.estado, res.complemento
                FROM responsavel res ORDER BY res.nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },
    visualizar: (idResponsavel) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT res.nome, res.id,res.cep ,res.data_nascimento, res.id_estado_civil, res.cpf_cnpj, res.identidade,
                    res.rua, res.bairro, res.numero, res.cidade, res.complemento, res.estado
                    FROM responsavel res WHERE res.id = ${idResponsavel} 
                    ORDER BY res.nome`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows[0])
            })
        })
    },
    editar: async (responsavel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let update = await db.query(`UPDATE responsavel SET nome = '${responsavel.nome.trim()}' , data_nascimento = '${responsavel.data_nascimento}',
            id_estado_civil = ${responsavel.id_estado_civil}, cpf_cnpj = '${responsavel.cpf_cnpj}', identidade = '${responsavel.identidade}',
            cep = '${responsavel.cep}', rua = '${responsavel.rua}', bairro = '${responsavel.bairro}', cidade = '${responsavel.cidade}',
            estado = '${responsavel.estado}', numero = '${responsavel.numero}', complemento = '${responsavel.complemento}',
            alterado_em = '${agora}', alterado_por = ${idUsuario}
            WHERE id = ${responsavel.id} RETURNING id`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        let select = await db.query(`SELECT res.nome, res.id,res.cep ,res.data_nascimento, res.id_estado_civil, res.cpf_cnpj, res.identidade,
                    res.rua, res.bairro, res.numero, res.cidade, res.complemento, res.estado
                    FROM responsavel res WHERE res.id = ${update.id} 
                    ORDER BY res.nome
            `).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
        })

        return {responsavel: select}
    },
    deletar:async (idResponsavel) => {
        let deletado = await db.query(`DELETE FROM responsavel WHERE id = ${idResponsavel}`).then(resp => {
            return resp.rows[0]
        }).catch(e => {
            console.log(e)
            return Promise.reject(e);
        })

        return {responsavel: deletado}
    }
}
