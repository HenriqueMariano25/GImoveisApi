const clienteDao = require('../dao/clienteDao')
const dayjs = require('dayjs')
const axios = require('axios')
const caixaDao = require("../dao/caixaDao");

class ClienteController {
    async visualizarTodos(res) {
        await clienteDao.visualizarTodos().then(consulta => {
            res.json(consulta)
        })
    }

    async visualizar(req, res) {
        let idCliente = req.query.idCliente
        await clienteDao.visualizar(idCliente).then(consulta => {
            res.json(consulta)
        })
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await clienteDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async cadastrar(req, res) {
        const cliente = req.body.data
        let cep = cliente.cep
        let idUsuario = req.body.idUsuario
        cliente.cep = cliente.cep !== null ? cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '') : null
        let naoFormatarNull = ['estado_civil', 'status']
        for(let key of Object.keys(cliente)){
            cliente[key] = cliente[key] === null && !naoFormatarNull.includes(key)  ? '' : cliente[key]
        }
        await clienteDao.cadastrar(cliente, idUsuario).then(consulta => {
            res.json(consulta)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome ou Email duplicado"})
            }
        })
    }

    async editar(req, res) {
        let idCliente = req.params.id
        let cliente = req.body.data
        let cep = cliente.cep
        let idUsuario  = req.body.idUsuario
        cliente.cep = cliente.cep !== null ? cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '') : null
        await clienteDao.editar(idCliente, cliente, idUsuario).then(consulta => {
            res.status(200).json(consulta)
        }).catch(erro => {
            if(erro.code == "23505"){
                res.status('500').json({erro:"Nome ou Email duplicado"})
            }
        })
    }

    async deletar(req, res) {
        let idCliente = req.params.id
        await clienteDao.deletarTelefoneCliente(idCliente)
        await clienteDao.deletarCliente(idCliente).then(
            res.status(200).json('Deu mack')
        )
    }

    async consultarCep(req, res) {
        let cep = req.params.cep
        axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(response => {
            res.status(200).json(response.data)
        })
    }

    async tipoStatus(res){
        await clienteDao.tipoStatus().then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async cadastrarTelefone(req, res){
        let telefone = req.body.telefone
        let idCliente = req.body.idCliente
        let idUsuario = req.body.idUsuario
        await clienteDao.cadastrarTelefone(idCliente, telefone, idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async editarTelefone(req, res){
        let telefone = req.body.telefone
        let idUsuario = req.body.idUsuario
        await clienteDao.editarTelefone(telefone,idUsuario).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarTelefone(req,res){
        let idTelefone = req.query.idTelefone
        await clienteDao.deletarTelefone(idTelefone).then(response => {
            res.status(200).json(response)
        })
    }

    async contratos(req,res){
        let idCliente = req.query.idCliente
        await clienteDao.contratos(idCliente).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async boletos(req,res){
        let idContrato = req.query.idContrato
        await clienteDao.boletos(idContrato).then(response => {
            res.status(200).json(response)
        })
    }
}

module.exports = new ClienteController()
