const homeDao = require('../dao/homeDao')
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

class HomeController {
    async contratosVencendo(res) {
        // console.log("Aqa")

        let diaVencimento = dayjs().add(60, 'day').format('YYYY-MM-DD')
        let diaAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.contratosVencendo(diaVencimento, diaAtual).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async graficosTodosContratos(req, res) {
        try {

            let contratos = await homeDao.todosContratos()

            let contratosFormatos = {}

            for (let c of contratos) {

                if (!Object.keys(contratosFormatos).includes(c.status)) {
                    contratosFormatos[c.status] = 1
                } else {
                    contratosFormatos[c.status] += 1
                }
            }

            return res.status(200).json({falha: false, dados: {contratos: contratosFormatos}})
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
    }
}

module.exports = new HomeController()