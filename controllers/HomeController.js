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
        let dataAtual = dayjs().format('YYYY-MM-DD')
        await homeDao.boletosVencendo(dataAtual).then(consulta => {
            let inicioMesAtual = dayjs(dataAtual).startOf('month').format('YYYY-MM-DD')
            let diasMesAtual = dayjs(dataAtual).diff(inicioMesAtual, 'days')
            let totalDiasMesAtual = dayjs(dataAtual).daysInMonth()
            let mesAtual = dayjs(dataAtual).month() + 1
            consulta.forEach((boleto) => {
                if(boleto.juros_multa){
                    let fimMesVencimento = dayjs(boleto.data_vencimento).endOf('month').format('YYYY-MM-DD')
                    let diasMesVencimento = dayjs(fimMesVencimento).diff(boleto.data_vencimento, 'days') + 1
                    let totalDiasMesVencimento = dayjs(boleto.data_vencimento).daysInMonth()
                    let mesVencimento = dayjs(boleto.data_vencimento).month() + 1
                    let periodo = (diasMesVencimento / totalDiasMesVencimento) + (diasMesAtual / totalDiasMesAtual)
                    if(dayjs(dataAtual).diff(boleto.data_vencimento, 'days') <= 15) {
                        periodo -= 1
                    }else if(mesAtual - mesVencimento > 1){
                        periodo += (mesAtual - mesVencimento) - 1
                    }
                    let anos_vencidos = dayjs(dataAtual).diff(boleto.data_vencimento, 'years')
                    if(anos_vencidos == 1){
                        periodo = periodo += 11 * anos_vencidos
                    }else if(anos_vencidos > 1){
                        periodo = periodo += 11 + (12 * (anos_vencidos - 1))
                    }
                    let valorOriginal = parseFloat(boleto.valor)
                    let porcentJurosAoMes = parseFloat(boleto.juros_mes)
                    let porcentJurosTotal = porcentJurosAoMes * periodo
                    let valorJurosTotal = (valorOriginal*(porcentJurosTotal/100))
                    let valorComJuros = valorOriginal + valorJurosTotal
                    let porcentMulta = parseFloat(boleto.multa)
                    let valorMultaTotal = valorComJuros*(porcentMulta/100)
                    let valorComJurosMulta = valorComJuros + valorMultaTotal
                    boleto.valor_juros = valorComJurosMulta.toFixed(2)
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