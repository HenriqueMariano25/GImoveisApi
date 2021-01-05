const telefoneDao = require('../dao/telefoneDao')

class TelefoneController {
    async visualizarTiposTelefones(res) {
        const consulta = await telefoneDao.visualizarTiposTelefones()
        res.json(consulta)
    }
}

module.exports = new TelefoneController()