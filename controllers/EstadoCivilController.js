const estaoCivilDao = require('../dao/estadoCivilDao')

class EstadoCivilController {
    async visualizarTodos(res) {
        const consulta = await estaoCivilDao.visualizarTodos()
        res.json(consulta)
    }
}

module.exports = new EstadoCivilController()