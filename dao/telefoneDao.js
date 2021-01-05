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
}