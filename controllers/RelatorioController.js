const relatorioDao = require('../dao/relatorioDao')

class RelatorioController {
    async relatorioAlugueisPendentes(req, res){
        let { filtro } = req.query

        console.log("Aqui")
        console.log(filtro)

        try{
            let relatorio = await relatorioDao.alugueisPendentes(filtro)

            return res.status(200).json({ falha: false, dados: { relatorio } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }
}

module.exports = new RelatorioController