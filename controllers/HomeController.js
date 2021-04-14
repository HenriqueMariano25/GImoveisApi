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
    async boletosVencendo(res){
        let diaAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.boletosVencendo(diaAtual).then(consulta => {
            consulta.forEach((boleto) => {
                var meses_atrasados = dayjs(diaAtual).diff(boleto.data_vencimento, 'month', true)
                if(boleto.juros_multa){
                    let valor = parseFloat(boleto.valor)
                    let juros = parseFloat(boleto.juros_mes)
                    let multa = parseFloat(boleto.multa)
                    let valor_juros_mes = valor*((juros/100) * parseInt(meses_atrasados + 1))
                    let total_juros_mes = valor + valor_juros_mes
                    let valor_multa = total_juros_mes*(multa/100)
                    boleto.valor_juros = (total_juros_mes + valor_multa).toFixed(2)
                    homeDao.aplicarJuros(boleto)
                }
                if(boleto.id_status_boleto != 2){
                    homeDao.alterarParaAtrasado(boleto.id)
                }
            })
            res.status(200).json(consulta)
        })
    }
}
module.exports = new HomeController()