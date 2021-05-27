const caixaDao = require('../dao/caixaDao')

class CaixaController {
    async cadastrar(req, res) {
        // console.log(req.body)
        let caixa = req.body.caixa
        let idUsuario = req.body.idUsuario
        console.log(req.body)
        await caixaDao.cadastrar(caixa, idUsuario).then((resposta) => {
            console.log('voltei')
            res.status(200).json(resposta)
        })
    }

    async visualizarTodos(res){
        await caixaDao.visualizarTodos().then(consulta => {
            console.log(consulta)
            res.status(200).json(consulta)
        })
    }
}

module.exports = new CaixaController()