const clienteDao = require('../dao/clienteDao')
const dayjs = require('dayjs')
const axios = require('axios')

class ClienteController {
    async visualizarTodos(res) {
        const consulta = await clienteDao.visualizarTodos()
        console.log(consulta)
        res.json(consulta)
    }

    async visualizar(req,res) {
        let idCliente = req.query.idCliente
        const consulta = await clienteDao.visualizar(idCliente)

        consulta.data_nascimento = dayjs(consulta.data_nascimento).format('YYYY-MM-DD')
        console.log(consulta)
        res.json(consulta)
    }

    async cadastrar(req,res) {
        const dadosCliente = req.body.data
        let telefones = req.body.telefones
        console.log(dadosCliente)
        const consulta = await clienteDao.cadastrar(dadosCliente)
        let idCliente = consulta[0].id
        console.log(dadosCliente)
        for(let index  in telefones){
            let numeroTelefone = telefones[index].numero
            let tipoTelefone = telefones[index].tipo
            await clienteDao.cadastrarTelefone(idCliente,numeroTelefone,tipoTelefone )
        }
        res.json(consulta)
    }

    async editar(req, res){
        let idCliente = req.params.id
        let dadosCliente = req.body.data
        let telefones = req.body.telefones
        const consulta = await clienteDao.editar(idCliente, dadosCliente)
        for(let index in telefones){
            let dadosTelefone = telefones[index]
            clienteDao.editarTelefone(dadosTelefone)
        }
        res.status(200).json(consulta)
    }

    async deletar(req, res){
        let idCliente = req.params.id
        console.log(idCliente)
        await clienteDao.deletarTelefoneCliente(idCliente)
        await clienteDao.deletarCliente(idCliente).then(
            res.status(200).json('Deu mack')
        )
    }

    async consultarCep(req, res){
        let cep = req.params.cep
        axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(response => {
            res.status(200).json(response.data)
        })
    }
}

module.exports = new ClienteController()