const db = require('../db/conexao')

module.exports = {
    visualizarTodos: usuario => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM estado_civil`,
                (erro, resultado) => {
                    if (erro) {
                        return reject(erro)
                    }
                    return resolve(resultado.rows)
                })
        })
    },
}