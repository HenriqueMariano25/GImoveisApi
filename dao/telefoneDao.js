const db = require('../db/conexao')

module.exports = {
    visualizarTiposTelefones: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *
                FROM tipo_telefone ORDER BY descricao`,
                (erro, resultado) => {
                    if (erro) {
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
    telefones: (idCliente) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT tel.id, tel.id_tipo_telefone , tel.numero, tel.id_cliente, tel.observacao, tip_tel.descricao
            FROM telefone tel
            LEFT JOIN tipo_telefone tip_tel ON tel.id_tipo_telefone = tip_tel.id
            WHERE id_cliente = ${idCliente}`,
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
