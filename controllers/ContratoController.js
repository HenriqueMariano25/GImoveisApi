const contratoDao = require('../dao/contratoDao')
const dayjs = require('dayjs')
let fs = require('fs')

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
        await contratoDao.cadastrar(contrato).then(response => {
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
        await contratoDao.editar(contrato).then(response => {
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
        let data_vencimento = dayjs(boleto.data_vencimento).format('MM-DD-YYYY')
        await contratoDao.editarBoleto(boleto,data_vencimento).then(response => {
            res.status(200).json(response)
        })
    }
    async importarPDF(req,res){
        const idContrato = req.params.id
        const reqFiles = []
        const url = req.protocol + '://' + req.get('host')
        reqFiles.push(url + '/uploads/' + req.file.filename)
        await contratoDao.deletarPDF(idContrato).then(response => {
            if(response.length != 0){
                fs.unlink(`public/uploads/${response[0].nome}`, function(err) {
                    if (err) throw err;
                })
            }
            contratoDao.importarPDF(reqFiles[0],idContrato, req.file.filename).then(response => {
                res.status(200).json(response)
            })
        })

    }
}

module.exports = new ContratoController();
