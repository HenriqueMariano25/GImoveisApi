const homeDao = require('../dao/homeDao')
const dayjs = require('dayjs')

class HomeController {
    async contratosVencendo(res) {
        let diaVencimento = dayjs().add(60, 'day').format('YYYY-MM-DD')
        console.log(diaVencimento)
        await homeDao.contratosVencendo(diaVencimento).then(consulta => {
            console.log(consulta)
            res.status(200).json(consulta)
        })
    }
}
module.exports = new HomeController()