const clienteDao = require('../dao/clienteDao')
const dayjs = require('dayjs')
const axios = require('axios')

class ClienteController {
    async visualizarTodos(res) {
        await clienteDao.visualizarTodos().then(consulta => {
            for(let x = 0; x < consulta.length; x++){
                consulta[x].data_formatada = dayjs(consulta[x].data_nascimento).format('DD/MM/YYYY')
            }
            res.json(consulta)
        })
    }

    async visualizar(req, res) {
        let idCliente = req.query.idCliente
        const consulta = await clienteDao.visualizar(idCliente)
        consulta.data_nascimento = dayjs(consulta.data_nascimento).format('YYYY-MM-DD')
        res.json(consulta)
    }

    async cadastrar(req, res) {
        const cliente = req.body.data
        console.log(cliente)
        let telefones = req.body.telefones
        let cpf_cnpj = cliente.cpf_cnpj
        let cep = cliente.cep
        cliente.cpf_cnpj = cpf_cnpj.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        cliente.cep = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        await clienteDao.cadastrar(cliente).then(consulta => {
            let idCliente = consulta[0].id
            for (let index in telefones) {
                if (telefones[index].numero != "" && telefones[index].tipo != "") {
                    let numeroTelefone = telefones[index].numero
                    let tipoTelefone = telefones[index].tipo
                    clienteDao.cadastrarTelefone(idCliente, numeroTelefone, tipoTelefone)
                }
            }
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
        let telefones = req.body.telefones
        let cpf_cnpj = cliente.cpf_cnpj
        let cep = cliente.cep
        cliente.cpf_cnpj = cpf_cnpj.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        cliente.cep = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        await clienteDao.editar(idCliente, cliente).then(consulta => {
            for (let index in telefones) {
                let numeroTelefone = telefones[index].numero
                let tipoTelefone = telefones[index].tipo
                let idTelefone = telefones[index].id
                if(numeroTelefone != "" && tipoTelefone != null) {
                    if (idTelefone == null) {

                        clienteDao.cadastrarTelefone(idCliente, numeroTelefone, tipoTelefone)
                    } else {
                        clienteDao.editarTelefone(telefones[index])
                    }
                }
            }
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
        await clienteDao.tipoStatus().then(response => {
            res.status(200).json(response)
        })
    }

    async deletarTelefone(req,res){
        let idTelefone = req.body.idTelefone
        await clienteDao.deletarTelefone(idTelefone).then(() => {
            res.status(200).json()
        })
    }
}

module.exports = new ClienteController()
