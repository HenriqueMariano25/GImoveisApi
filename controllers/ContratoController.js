const contratoDao = require('../dao/contratoDao')
const boletoDao = require('../dao/boletoDao')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const aws = require('aws-sdk')
const {deletarPDF} = require("../dao/contratoDao");
const {response} = require("express");
const caixaDao = require("../dao/caixaDao");
const responsavelDao = require("../dao/responsavelDao");
const limparDados = require("../functions/limparDados");

const s3 = new aws.S3()

class ContratoController {
    async visualizarTodos(req, res) {

        let { todos } = req.query

        await contratoDao.visualizarTodos(todos).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async visualizarTodosNovoPadrao(req, res) {
        let {pagina, itensPorPagina} = req.query
        let filtro = req.query.filtro || null

        try {

            if(filtro === null)
                filtro = "ativo"

            let contratos = await contratoDao.visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro)
            let total = await contratoDao.contarContratos(filtro)

            return res.status(200).json({falha: false, dados: {contratos, total}})
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async visualizar(req, res) {
        let {id} = req.query
        await contratoDao.visualizar(id).then(contrato => {
            res.status(200).json({contrato: contrato})
        })
    }

    async cadastrar(req, res) {
        let {contrato, idUsuario} = req.body

        await contratoDao.cadastrar(contrato, idUsuario).then(resp => {
            let idContrato = resp.contrato.id
            let contratoParaRetornar = resp.contrato
            let data_inicio = contrato.data_inicio
            let data_fim = contrato.data_fim
            let dia_vencimento = contrato.data_vencimento
            let valor_boleto = contrato.valor_boleto_convertido
            let data_vencimento_inicial = ''
            let vigencia = 0
            let dia_inicio = dayjs(data_inicio).get('date')

            if (dia_inicio >= dia_vencimento) {
                data_vencimento_inicial = dayjs(data_inicio).date(dia_vencimento).add(1, 'month').format('YYYY-MM-DD')
            } else {
                data_vencimento_inicial = dayjs(data_inicio).date(dia_vencimento).format('YYYY-MM-DD')
            }
            let data_vencimento = data_vencimento_inicial

            while (dayjs(data_vencimento).isBefore(dayjs(data_fim, 'day'))) {
                if (dayjs(data_vencimento_inicial).add(vigencia + 1, 'month').isAfter(dayjs(data_fim, 'day'))) {
                    data_vencimento = dayjs(data_vencimento_inicial).add(vigencia, 'month').format('YYYY-MM-DD')
                    vigencia += 1
                    let dias_faltando = dayjs(data_fim).diff(data_vencimento, 'day')

                    let valor_restante = (valor_boleto / 30) * dias_faltando
                    valor_boleto = Number(parseFloat(valor_boleto) + parseFloat(valor_restante)).toFixed(2)

                    contratoDao.gerarBoleto(idContrato, data_vencimento, valor_boleto)
                    break
                } else {
                    data_vencimento = dayjs(data_vencimento_inicial).add(vigencia, 'month').format('YYYY-MM-DD')
                    contratoDao.gerarBoleto(idContrato, data_vencimento, valor_boleto)
                    vigencia += 1
                }

            }
            contratoDao.atualizarVigencia(idContrato, vigencia)


            let idImovel = contrato.id_imovel
            contratoDao.atualizarImovelAlugado(idImovel)

            contratoParaRetornar.vigencia = vigencia
            res.status(200).json(contratoParaRetornar)
        })
    }

    async cadastrarNovoPadrao(req, res){
        let {contrato, idUsuario} = req.body

        let contratolFormatado = limparDados(contrato);

        await contratoDao.cadastrarNovoPadrao(contratolFormatado, idUsuario).then(resp => {
            let idContrato = resp.contrato.id
            let contratoParaRetornar = resp.contrato
            let data_inicio = contrato.data_inicio
            let data_fim = contrato.data_fim
            let dia_vencimento = contrato.data_vencimento
            let valor_boleto = contrato.valor_boleto
            let data_vencimento_inicial = ''
            let vigencia = 0
            let dia_inicio = dayjs(data_inicio).get('date')

            if (dia_inicio >= dia_vencimento) {
                data_vencimento_inicial = dayjs(data_inicio).date(dia_vencimento).add(1, 'month').format('YYYY-MM-DD')
            } else {
                data_vencimento_inicial = dayjs(data_inicio).date(dia_vencimento).format('YYYY-MM-DD')
            }
            let data_vencimento = data_vencimento_inicial

            while (dayjs(data_vencimento).isBefore(dayjs(data_fim, 'day'))) {
                if (dayjs(data_vencimento_inicial).add(vigencia + 1, 'month').isAfter(dayjs(data_fim, 'day'))) {
                    data_vencimento = dayjs(data_vencimento_inicial).add(vigencia, 'month').format('YYYY-MM-DD')
                    vigencia += 1
                    let dias_faltando = dayjs(data_fim).diff(data_vencimento, 'day')

                    let valor_restante = (valor_boleto / 30) * dias_faltando
                    valor_boleto = Number(parseFloat(valor_boleto) + parseFloat(valor_restante)).toFixed(2)

                    contratoDao.gerarBoleto(idContrato, data_vencimento, valor_boleto)
                    break
                } else {
                    data_vencimento = dayjs(data_vencimento_inicial).add(vigencia, 'month').format('YYYY-MM-DD')
                    contratoDao.gerarBoleto(idContrato, data_vencimento, valor_boleto)
                    vigencia += 1
                }

            }
            contratoDao.atualizarVigencia(idContrato, vigencia)


            let idImovel = contrato.id_imovel
            contratoDao.atualizarImovelAlugado(idImovel)

            contratoParaRetornar.vigencia = vigencia
            res.status(200).json(contratoParaRetornar)
        })
    }

    async editar(req, res) {
        let contrato = req.body.contrato
        let idUsuario = req.body.idUsuario
        await contratoDao.editar(contrato, idUsuario).then(resposta => {
            let idImovel = contrato.id_imovel
            contratoDao.atualizarImovelAlugado(idImovel)

            let {valor_boleto_convertido: valorBoleto, data_vencimento, id: idContrato} = contrato

            contratoDao.atualizarBoletoContrato(idContrato, valorBoleto, data_vencimento)

            res.status(200).json(resposta)
        }).catch(erro => {
            console.log(erro)
        })


    }

    async deletar(req, res) {
        let {id} = req.params
        let { id_usuario } = req.query

        await contratoDao.deletarContrato(id, id_usuario).then(response => {
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
        await contratoDao.boletos(idContrato).then(resp => {
            res.status(200).json(resp)
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
        let idUsuario = req.body.idUsuario
        // let data_vencimento = dayjs(boleto.data_vencimento).format('YYYY-MM-DD')
        await contratoDao.editarBoleto(boleto, idUsuario).then(resp => {
            res.status(200).json(resp)
        })
    }

    async editarBoletoNovoPadrao(req, res) {
        let { boleto, usuario_id } = req.body

        let boletoFormatado = limparDados(boleto);

        try{
            await contratoDao.editarBoletoNovoPadrao(boletoFormatado, usuario_id)

            return res.status(200).json({ falha: false, dados: { boleto } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async cadastrarBoleto(req, res) {
        let {boleto, idContrato, idUsuario} = req.body
        await contratoDao.cadastrarBoleto(boleto, idContrato, idUsuario).then(resp => {
            res.status(200).json(resp)
        })
    }

    async deletarBoleto(req, res) {
        let {id} = req.query
        contratoDao.deletarBoleto(id).then(resp => {
            res.status(200).json(resp)
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
                            if (err)
                            console.log(err)
                        })
                }
            }
        })
        await contratoDao.importarPDF(url, idContrato, filename).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarPDF(req, res) {
        let arquivoDeletado

        const idContrato = req.params.id
        await contratoDao.deletarPDF(idContrato).then(response => {
            arquivoDeletado = response[0]
            if (response.length !== 0) {
                if (process.env.STORAGE_TYPE === "s3") {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: arquivoDeletado.nome
                    }).promise()
                } else {
                    fs.unlink((path.resolve(__dirname, '..', 'tmp', 'uploads', arquivoDeletado.nome)),
                        function (err) {
                            if (err)
                            console.log(err)
                        })
                }
            }
            res.status(200).json(response)
        })
    }

    async importarAditivo(req, res) {
        const idContrato = req.params.id
        const filename = req.file.key
        let url = req.file.location
        if (!url) {
            url = `${req.protocol}://${req.get('host')}/files/${filename}`
        }
        await contratoDao.deletarAditivo(idContrato).then(response => {
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
                            if (err) console.log(err)
                        })
                }
            }
        })
        await contratoDao.importarAditivo(url, idContrato, filename).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarAditivo(req, res) {
        let arquivoDeletado

        const idContrato = req.params.id
        await contratoDao.deletarAditivo(idContrato).then(response => {
            arquivoDeletado = response[0]
            if (response.length !== 0) {
                if (process.env.STORAGE_TYPE === "s3") {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: arquivoDeletado.nome
                    }).promise()
                } else {
                    fs.unlink((path.resolve(__dirname, '..', 'tmp', 'uploads', arquivoDeletado.nome)),
                        function (err) {
                            if (err) console.log(err)
                        })
                }
            }
        })
        res.status(200).json(response)
    }

    async cadastrarFiador(req, res) {
        let fiador = req.body.fiador
        let idContrato = req.body.idContrato
        let idUsuario = req.body.idUsuario
        await contratoDao.cadastrarFiador(fiador, idContrato, idUsuario).then(resp => {
            res.status(200).json(resp)
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
        let idUsuario = req.body.idUsuario
        await contratoDao.editarFiador(fiador, idUsuario).then(resp => {
            res.status(200).json(resp)
        })
    }

    async deletarFiador(req, res) {
        let idFiador = req.query.idFiador
        await contratoDao.deletarFiador(idFiador).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async aplicarReajuste(req, res) {
        let {id} = req.body
        let reajuste = parseFloat(req.body.reajuste)
        let valor_original = parseFloat(req.body.valor)
        let valor_reajustado_original = req.body.valor_reajustado
        let valor_reajuste = ""
        let valor_anterior = ""
        if (valor_reajustado_original) {
            valor_anterior = valor_reajustado_original
            valor_reajuste = (valor_reajustado_original * ((reajuste / 100) + 1)).toFixed(2)
        } else {
            valor_anterior = valor_original
            valor_reajuste = (valor_original * ((reajuste / 100) + 1)).toFixed(2)
        }

        let dataHoje = dayjs().format('YYYY-MM-DD')
        await contratoDao.aplicarReajuste(valor_reajuste, id, dataHoje, valor_anterior).then(contrato => {
            boletoDao.aplicarReajuste(valor_reajuste, dataHoje, id).then(() => {
                res.status(200).json({valor_reajustado: valor_reajuste, ultimo_reajuste: contrato[0].ultimo_reajuste, valor_anterior: valor_anterior})
            })
        })
    }

    async contratosParaReajustar(req, res) {
        let anoPassado = dayjs().subtract(1, 'year').add(60, 'days').format('YYYY-MM-DD')
        await contratoDao.contratosParaReajustar(anoPassado).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async reverterReajuste(req, res) {
        let {id, valor_anterior} = req.body

        let valor_reajuste = parseFloat(valor_anterior)

        let dataHoje = dayjs().format('YYYY-MM-DD')
        await contratoDao.aplicarReajuste(valor_reajuste, id, dataHoje, valor_anterior).then(contrato => {
            boletoDao.aplicarReajuste(valor_reajuste, dataHoje, id).then(() => {
                res.status(200).json({valor_reajustado: valor_reajuste, ultimo_reajuste: contrato[0].ultimo_reajuste})
            })
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await contratoDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }


}

module.exports = new ContratoController();
