const telefoneDao = require('../dao/telefoneDao')

class TelefoneController {
    async visualizarTiposTelefones(res) {
        const consulta = await telefoneDao.visualizarTiposTelefones()
        res.json(consulta)
    }
    async telefones(req,res){
        const idCliente = req.query.idCliente
        await telefoneDao.telefones(idCliente).then(consulta => {
            console.log(consulta)
            res.status(200).json(consulta)
        })
    }
}

module.exports = new TelefoneController()
