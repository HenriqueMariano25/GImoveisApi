const homeDao = require('../dao/homeDao')
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

class HomeController {
    async contratosVencendo(res) {
        let diaVencimento = dayjs().add(60, 'day').format('YYYY-MM-DD')
        let diaAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.contratosVencendo(diaVencimento, diaAtual).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}
module.exports = new HomeController()