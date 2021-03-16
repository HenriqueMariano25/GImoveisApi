const clienteDao = require('../dao/clienteDao')
const dayjs = require('dayjs')
const axios = require('axios')

class ClienteController {
    async visualizarTodos(res) {
        await clienteDao.visualizarTodos().then(consulta => {
            for(let x = 0; x < consulta.length; x++){
                // consulta[x].data_formatada = dayjs(consulta[x].data_nascimento).format('DD/MM/YYYY')
            }
            res.json(consulta)
        })
    }

    async visualizar(req, res) {
        let idCliente = req.query.idCliente
        await clienteDao.visualizar(idCliente).then(consulta => {
            // consulta.data_nascimento = dayjs(consulta.data_nascimento).format('YYYY-MM-DD')
            res.json(consulta)
        })
    }

    async cadastrar(req, res) {
        console.log('CADASTRANDO CLIENTE')
        const cliente = req.body.data
        console.log(cliente)
        let cep = cliente.cep
        console.log('cep: '+cep)
        let idUsuario = req.body.idUsuario
        console.log('id_usuario: '+idUsuario)
        cliente.cep = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
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
        let cpf_cnpj = cliente.cpf_cnpj
        let cep = cliente.cep
        let idUsuario  = req.body.idUsuario
        // cliente.cpf_cnpj = cpf_cnpj.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        cliente.cep = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
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
        await clienteDao.cadastrarTelefone(idCliente, telefone).then(response => {
            res.status(200).json(response)
        })
    }

    async editarTelefone(req, res){
        let telefone = req.body.telefone
        await clienteDao.editarTelefone(telefone).then(response => {
            res.status(200).json(response)
        })
    }

    async deletarTelefone(req,res){
        let idTelefone = req.query.idTelefone
        await clienteDao.deletarTelefone(idTelefone).then(() => {
            res.status(200).json()
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
