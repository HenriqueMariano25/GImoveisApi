const db = require('../db/conexao')
const dayjs = require('dayjs')

module.exports = {
    visualizarTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                 cli.id,cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento , cli.cpf_cnpj, cli.identidade,
                 cli.data_nascimento, cli.referencia , cli.numero, ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tip_tel.descricao) tipo_telefone, cli.id, 
                 sta.descricao status, cli.observacao
                FROM telefone tel
                FULL OUTER JOIN cliente cli ON tel.id_cliente = cli.id
                LEFT OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                LEFT OUTER JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id 
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                 cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.id
                 ORDER BY nome`,
                (erro, resultado) => {
                    if (erro) {
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },

    visualizar: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                 cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento , cli.cpf_cnpj,
                 cli.identidade,cli.data_nascimento, cli.referencia , cli.numero, sta.id status,
                 cli.id, cli.cep,cli.id_estado_civil estado_civil,ARRAY_AGG(tel.id) id_telefone, 
                 ARRAY_AGG(tel.numero) numero_telefone, ARRAY_AGG(tel.id_tipo_telefone) id_tipo_telefone, 
                 ARRAY_AGG(tip_tel.descricao) tipo_telefone,ARRAY_AGG(tel.observacao) observacao_telefone ,cli.observacao, cli.tipo_cliente
                FROM cliente cli
                FULL OUTER JOIN telefone tel ON tel.id_cliente = cli.id
                FULL JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
                FULL OUTER JOIN status_cliente sta ON sta.id = cli.id_status_cliente
                WHERE cli.id = ${idCliente}
                GROUP BY cli.nome, cli.email, cli.rua, cli.bairro, cli.cidade, cli.estado, cli.complemento, cli.cpf_cnpj,
                cli.identidade, cli.data_nascimento, cli.referencia, cli.numero, cli.id, status, cli.observacao, cli.tipo_cliente`,
                (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        return reject(erro)
                    }
                    return resolve(resultado.rows[0])
                })
        })
    },

    cadastrar: (cliente, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO cliente(
            nome,rua,cep,bairro,cidade,estado,complemento,cpf_cnpj,identidade,email,referencia,data_nascimento, id_estado_civil,
            numero, id_status_cliente, observacao, tipo_cliente, criado_em, alterado_em, criado_por, alterado_por
            ) VALUES (
            '${cliente.nome}','${cliente.rua}','${cliente.cep}','${cliente.bairro}','${cliente.cidade}',
            '${cliente.estado}','${cliente.complemento}','${cliente.cpf_cnpj}','${cliente.identidade}',
            '${cliente.email}','${cliente.referencia}','${cliente.data_nascimento}',${cliente.estado_civil},
            '${cliente.numero}', ${cliente.status}, '${cliente.observacao}', '${cliente.tipo_cliente}',
            '${agora}', '${agora}', ${idUsuario}, ${idUsuario}
            ) RETURNING nome, id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    editar: (idCliente, dadosCliente, idUsuario) => {
        let agora = dayjs().format('DD/MM/YYYY HH:mm:ss')
        return new Promise((resolve, reject) =>{
            db.query(`UPDATE cliente
            SET nome = '${dadosCliente.nome}', rua = '${dadosCliente.rua}',bairro = '${dadosCliente.bairro}', 
            cidade = '${dadosCliente.cidade}', estado = '${dadosCliente.estado}', complemento = '${dadosCliente.complemento}',
            identidade = '${dadosCliente.identidade}', email = '${dadosCliente.email}', referencia = '${dadosCliente.referencia}',
            id_estado_civil = ${dadosCliente.estado_civil}, cpf_cnpj = '${dadosCliente.cpf_cnpj}', cep = '${dadosCliente.cep}',
            data_nascimento = '${dadosCliente.data_nascimento}',numero = '${dadosCliente.numero}', 
            id_status_cliente = ${dadosCliente.status}, observacao = '${dadosCliente.observacao}', 
            tipo_cliente = '${dadosCliente.tipo_cliente}', alterado_em = "${agora}",
            alterado_por = ${idUsuario}
            WHERE id = ${idCliente} RETURNING nome, id`,(erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarCliente: idCliente => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM cliente WHERE id = ${idCliente}`,(erro,resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado)
            })
        })
    },

    editarTelefone:(dadosTelefone) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE telefone
            SET numero = '${dadosTelefone.numero}', id_tipo_telefone = ${dadosTelefone.id_tipo}, observacao = '${dadosTelefone.observacao}'
            WHERE id = ${dadosTelefone.id}`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    cadastrarTelefone: (idCliente, numeroTelefone, tipoTelefone,observacaoTelefone) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO telefone(  
            id_cliente,numero,id_tipo_telefone,observacao
            ) VALUES (
            ${idCliente}, '${numeroTelefone}',${tipoTelefone}, '${observacaoTelefone}'
            ) RETURNING id`, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarTelefoneCliente: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM telefone WHERE id_cliente = ${idCliente}`, (erro, resultado) =>{
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    deletarTelefone: (idTelefone) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM telefone WHERE id = ${idTelefone}`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    tipoStatus: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM status_cliente ORDER BY descricao`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    contratos: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT con.id, con.data_inicio, con.data_fim, imo.nome, sta_con.descricao status
             FROM contrato con 
             LEFT JOIN imovel imo ON con.id_imovel = imo.id
             LEFT JOIN status_contrato sta_con ON con.id_status_contrato = sta_con.id
             WHERE id_cliente = ${idCliente} AND deletado = 'false'`, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    },

    boletos: (idContrato) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT bol.id, bol.data_vencimento , sta_bol.descricao status, bol.valor, bol.data_quitacao
            FROM boleto bol
            LEFT JOIN status_boleto sta_bol ON bol.id_status_boleto = sta_bol.id 
            WHERE id_contrato = ${idContrato} ORDER BY data_vencimento`,(erro, resultado) => {
                if(erro){
                    console.log(erro)
                    return reject(erro)
                }
                return resolve(resultado.rows)
            })
        })
    }
}
