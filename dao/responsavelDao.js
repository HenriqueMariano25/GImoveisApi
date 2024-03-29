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

    cadastrarNovoPadrao: async (responsavel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let sql = `
            INSERT INTO responsavel(nome, data_nascimento, cpf_cnpj, identidade, id_estado_civil,cep,rua,
                    numero,bairro,cidade,estado, complemento, criado_em, alterado_em, criado_por, alterado_por)
                    VALUES (${responsavel.nome},${responsavel.data_nascimento},${responsavel.cpf_cnpj},
                    ${responsavel.identidade},${responsavel.id_estado_civil},${responsavel.cep},${responsavel.rua},
                    ${responsavel.numero},${responsavel.bairro},${responsavel.cidade},${responsavel.estado},
                    ${responsavel.complemento}, '${agora}', '${agora}', ${idUsuario}, ${idUsuario})
                    RETURNING id`

        let insert = await db.query(sql).then(resp => {
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

    visualizarTodosNovoPadrao: (pagina, itensPorPagina, filtro) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT res.nome, res.id, res.cpf_cnpj, res.rua, res.numero, res.cidade, res.bairro, res.estado, res.complemento
                FROM responsavel res
                WHERE res.deletado_em IS NULL 
                ${filtro ? `AND (unaccent(res.nome) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.rua) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.bairro) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.cidade) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.numero) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.estado) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.cpf_cnpj) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.complemento) ILIKE unaccent('%${filtro}%'))` : ''}
                ORDER BY res.nome
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

    contarResponsaveis: async (filtro) => {
        return await db.query(`
            SELECT 
                COUNT(res.id) total
            FROM responsavel res 
            WHERE 
                deletado_em IS NULL 
                ${filtro ? `AND (unaccent(res.nome) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.rua) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.bairro) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.cidade) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.numero) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.estado) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.cpf_cnpj) ILIKE unaccent('%${filtro}%') 
                OR unaccent(res.complemento) ILIKE unaccent('%${filtro}%'))` : ''}
            `)
        .then(resp => resp.rows[0].total)
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

    editarNovoPadrao: async (responsavel, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')

        let sql = `UPDATE responsavel 
            SET nome = ${responsavel.nome},
            data_nascimento = ${ responsavel.data_nascimento },
            id_estado_civil = ${responsavel.id_estado_civil}, 
            cpf_cnpj = ${responsavel.cpf_cnpj},
            identidade = ${responsavel.identidade},
            cep = ${responsavel.cep}, 
            rua = ${responsavel.rua}, 
            bairro = ${responsavel.bairro}, 
            cidade = ${responsavel.cidade},
            estado = ${responsavel.estado}, 
            numero = ${responsavel.numero}, 
            complemento = ${responsavel.complemento},
            alterado_em = '${agora}', 
            alterado_por = ${idUsuario}
            WHERE id = ${responsavel.id} 
            RETURNING id`

        let update = await db.query(sql).then(resp => {
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
    },

    deletarNovoPadrao: async (idResponsavel, idUsuario) => {
        let agora = dayjs().format("DD/MM/YYYY HH:mm:ss");

        return new Promise((resolve, reject) => {
            db.query(`UPDATE responsavel SET deletado_em = '${agora}',
               deletado_por = ${idUsuario}
            WHERE id = ${idResponsavel} RETURNING nome, id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    visualizarBusca: (busca) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT res.nome, res.id, res.cpf_cnpj, res.rua, res.numero, res.cidade, res.bairro, res.estado, res.complemento
                FROM responsavel res
                WHERE LOWER(res.nome) LIKE LOWER('%${busca}%') 
                OR LOWER(res.rua) LIKE LOWER('%${busca}%') 
                OR LOWER(res.bairro) LIKE LOWER('%${busca}%') 
                OR LOWER(res.cidade) LIKE LOWER('%${busca}%') 
                OR LOWER(res.numero) LIKE LOWER('%${busca}%') 
                OR LOWER(res.estado) LIKE LOWER('%${busca}%') 
                OR LOWER(res.complemento) LIKE LOWER('%${busca}%') 
                ORDER BY res.nome
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
