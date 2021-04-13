const homeDao = require('../dao/homeDao')
const dayjs = require('dayjs')

class HomeController {
    async contratosVencendo(res) {
        let diaVencimento = dayjs().add(60, 'day').format('YYYY-MM-DD')
        let diaAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.contratosVencendo(diaVencimento, diaAtual).then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async boletosVencendo(res){
        let diaAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.boletosVencendo(diaAtual).then(consulta => {
            consulta.forEach((boleto) => {
                if(boleto.id_status_boleto != 2){
                    homeDao.alterarParaAtrasado(boleto.id)
                }
            })
            res.status(200).json(consulta)
        })
    }
}
module.exports = new HomeController()