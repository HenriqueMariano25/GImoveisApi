const db = require('../db/conexao')

module.exports = {
    cadastrar: responsavel => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO responsavel(nome, data_nascimento, cpf_cnpj, identidade, id_estado_civil,cep,rua,
                    numero,bairro,cidade,estado, complemento) 
                    VALUES ('${responsavel.nome}','${responsavel.data_nascimento}','${responsavel.cpf_cnpj}',
                    '${responsavel.identidade}',${responsavel.id_estado_civil},'${responsavel.cep}','${responsavel.rua}',
                    '${responsavel.numero}','${responsavel.bairro}','${responsavel.cidade}','${responsavel.estado}','${responsavel.complemento}')
                    RETURNING nome, id`, (erro, resultado) => {
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
            db.query(`SELECT res.nome, res.id, res.cpf_cnpj FROM responsavel res ORDER BY res.nome`, (erro, resultado) => {
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
                return resolve(resultado.rows)
            })
        })
    },
    editar: (responsavel) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE responsavel SET nome = '${responsavel.nome}' , data_nascimento = '${responsavel.data_nascimento}',
            id_estado_civil = ${responsavel.id_estado_civil}, cpf_cnpj = '${responsavel.cpf_cnpj}', identidade = '${responsavel.identidade}',
            cep = '${responsavel.cep}', rua = '${responsavel.rua}', bairro = '${responsavel.bairro}', cidade = '${responsavel.cidade}',
            estado = '${responsavel.estado}', numero = '${responsavel.numero}', complemento = '${responsavel.complemento}'
            WHERE id = ${responsavel.id} RETURNING nome, id`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    deletar:(idResponsavel) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM responsavel WHERE id = ${idResponsavel}`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.row)
            })
        })
    }
}