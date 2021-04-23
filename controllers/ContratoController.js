const contratoDao = require('../dao/contratoDao')
const boletoDao = require('../dao/boletoDao')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const aws = require('aws-sdk')

const s3 = new aws.S3()

class ContratoController {
    async visualizarTodos(res) {
        await contratoDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async visualizar(req, res) {
        let idContrato = req.query.idContrato
        await contratoDao.visualizar(idContrato).then(contrato => {
            contratoDao.fiador(idContrato).then(fiador => {
                res.status(200).json({contrato: contrato, fiador: fiador})
            })
        })
    }

    async cadastrar(req, res) {
        let contrato = req.body.contrato
        let idUsuario = req.body.idUsuario
        await contratoDao.cadastrar(contrato, idUsuario).then(response => {
            let idContrato = response[0].id
            for (let x = 0; x < contrato.vigencia; x++) {
                let data_vencimento = dayjs(contrato.data_vencimento).add(x, 'month').format('YYYY-MM-DD')
                contratoDao.gerarBoleto(idContrato, data_vencimento, contrato)
            }
            res.status(200).json(response)
        })
    }

    async editar(req, res) {
        let contrato = req.body.contrato
        let idUsuario = req.body.idUsuario
        await contratoDao.editar(contrato, idUsuario).then(resposta => {
            res.status(200).json(resposta)
        }).catch(erro => {
            console.log(erro)
        })
    }

    async deletar(req, res) {
        let idContrato = req.query.id
        await contratoDao.deletarContrato(idContrato).then(response => {
            res.status(200).json(response)
        })
    }

    async status(res) {
        await contratoDao.status().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async responsaveis(res) {
        await contratoDao.responsaveis().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async clientes(res) {
        await contratoDao.clientes().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async imoveis(res) {
        await contratoDao.imoveis().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async idFiador(res) {
        await contratoDao.idFiador().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async boletos(req, res) {
        let idContrato = req.query.idContrato
        await contratoDao.boletos(idContrato).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async boleto(req, res) {
        let idBoleto = req.query.idBoleto
        await contratoDao.boleto(idBoleto).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async statusBoleto(req, res) {
        await contratoDao.statusBoleto().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editarBoleto(req, res) {
        let boleto = req.body.boleto
        // let data_vencimento = dayjs(boleto.data_vencimento).format('YYYY-MM-DD')
        await contratoDao.editarBoleto(boleto).then(response => {
            res.status(200).json(response)
        })
    }

    async cadastrarBoleto(req, res) {
        let boleto = req.body.boleto
        let idContrato = req.body.idContrato
        await contratoDao.cadastrarBoleto(boleto, idContrato).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarBoleto(req, res) {
        let idBoleto = req.query.idBoleto
        contratoDao.deletarBoleto(idBoleto).then(response => {
            res.status(200).json(response)
        })
    }

    async importarPDF(req, res) {
        const idContrato = req.params.id
        const filename = req.file.key
        let url = req.file.location
        if (!url) {
            url = `${req.protocol}://${req.get('host')}/files/${filename}`
        }
        await contratoDao.deletarPDF(idContrato).then(response => {
            let arquivoDeletado = response[0]
            if (response.length != 0) {
                if (process.env.STORAGE_TYPE === "s3") {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: arquivoDeletado.nome
                    }).promise()
                } else {
                    fs.unlink((path.resolve(__dirname, '..', 'tmp', 'uploads', arquivoDeletado.nome)),
                        function (err) {
                            if (err) throw err;
                            console.log(err)
                        })
                }
            }
        })
        await contratoDao.importarPDF(url, idContrato, filename).then(response => {
            res.status(200).json(response)
        })
    }

    async cadastrarFiador(req, res) {
        let fiador = req.body.fiador
        let idContrato = req.body.idContrato
        await contratoDao.cadastrarFiador(fiador, idContrato).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async fiadores(req, res) {
        let idContrato = req.query.idContrato
        await contratoDao.fiadores(idContrato).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async editarFiador(req, res) {
        let fiador = req.body.fiador
        await contratoDao.editarFiador(fiador).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async deletarFiador(req, res) {
        let idFiador = req.query.idFiador
        await contratoDao.deletarFiador(idFiador).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async aplicarReajuste(req, res){
        let idContrato = req.body.contrato.id
        let reajuste = parseFloat(req.body.reajuste)
        let valor_original = parseFloat(req.body.valor)
        let valor_reajustado_original = req.body.valor_reajustado
        let valor_reajuste = ""
        if(valor_reajustado_original){
            valor_reajuste = (valor_reajustado_original * ((reajuste/100) + 1)).toFixed(2)
        }else{
            valor_reajuste = (valor_original * ((reajuste/100) + 1)).toFixed(2)
        }
        let dataHoje = dayjs().format('YYYY-MM-DD')
        await contratoDao.aplicarReajuste(valor_reajuste, idContrato, dataHoje).then(contrato => {
            boletoDao.aplicarReajuste(valor_reajuste, dataHoje, idContrato).then(() => {
                res.status(200).json({valor_reajustado: valor_reajuste, ultimo_reajuste: contrato[0].ultimo_reajuste})
            })
        })
    }

    async contratosParaReajustar(req, res){
        let anoPassado = dayjs().subtract(1, 'year').add(60, 'days').format('YYYY-MM-DD')
        await contratoDao.contratosParaReajustar(anoPassado).then(consulta => {
            res.status(200).json(consulta)
        })
    }


}

module.exports = new ContratoController();
