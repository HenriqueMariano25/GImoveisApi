const contratoDao = require('../dao/contratoDao')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const aws = require('aws-sdk')

const s3 = new aws.S3()

class ContratoController {
    async visualizarTodos(res){
        await contratoDao.visualizarTodos().then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async visualizar(req,res){
        let idContrato = req.query.idContrato
        await contratoDao.visualizar(idContrato).then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async cadastrar(req,res){
        let contrato = req.body.contrato
        let idUsuario = req.body.idUsuario
        await contratoDao.cadastrar(contrato, idUsuario).then(response => {
            for(let x = 0;x < contrato.vigencia;x++){
                let idContrato = response[0].id
                let data_vencimento = dayjs(contrato.data_vencimento).add(x, 'month').format('YYYY-MM-DD')
                contratoDao.gerarBoleto(idContrato, data_vencimento,contrato)
            }
            res.status(200).json(response)
        })
    }
    async editar(req,res){
        let contrato = req.body.contrato
        let idUsuario = req.body.idUsuario
        await contratoDao.editar(contrato, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }
    async deletar(req,res){
        let idContrato = req.query.id
        await contratoDao.deletarContrato(idContrato).then(response => {
            res.status(200).json(response)
        })
        // await contratoDao.deletarBoletos(idContrato)
        // await contratoDao.deletar(idContrato).then(response => {
        //     res.status(200).json(response)
        // })
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
    async idFiador(res){
        await contratoDao.idFiador().then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async boletos(req,res){
        let idContrato = req.query.idContrato
        await contratoDao.boletos(idContrato).then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async boleto(req,res){
        let idBoleto = req.query.idBoleto
        await contratoDao.boleto(idBoleto).then(consulta =>{
            res.status(200).json(consulta)
        })
    }
    async statusBoleto(req,res){
        await contratoDao.statusBoleto().then(consulta => {
            res.status(200).json(consulta)
        })
    }
    async editarBoleto(req, res){
        let boleto = req.body.boleto
        // let data_vencimento = dayjs(boleto.data_vencimento).format('YYYY-MM-DD')
        await contratoDao.editarBoleto(boleto).then(response => {
            res.status(200).json(response)
        })
    }
    async cadastrarBoleto(req, res){
        let boleto = req.body.boleto
        let idContrato = req.body.idContrato
        await contratoDao.cadastrarBoleto(boleto, idContrato).then(response => {
            res.status(200).json(response)
        })
    }
    async deletarBoleto(req, res){
        let idBoleto = req.query.idBoleto
        contratoDao.deletarBoleto(idBoleto).then(response => {
            res.status(200).json(response)
        })
    }
    async importarPDF(req,res){
        const idContrato = req.params.id
        const filename = req.file.key
        console.log(filename)
        let url = req.file.location
        console.log(req.file.location)
        if(!url){
            url = `${req.protocol}://${req.get('host')}/files/${filename}`
        }
        await contratoDao.deletarPDF(idContrato).then(response => {
            let arquivoDeletado = response[0]
            console.log(arquivoDeletado)
            if(response.length != 0) {
                if (process.env.STORAGE_TYPE === "s3") {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: arquivoDeletado.nome
                    }).promise()
                } else {
                    console.log('to aqui')
                    fs.unlink((path.resolve(__dirname, '..', 'tmp', 'uploads', arquivoDeletado.nome)),
                    function(err) {
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
}

module.exports = new ContratoController();
