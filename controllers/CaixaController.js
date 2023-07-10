const caixaDao = require('../dao/caixaDao')
const responsavelDao = require("../dao/responsavelDao");
const limparDados = require("../functions/limparDados");

class CaixaController {
    async cadastrar(req, res) {
        let caixa = req.body.caixa
        let idUsuario = req.body.idUsuario
        await caixaDao.cadastrar(caixa, idUsuario).then((resposta) => {
            res.status(200).json(resposta)
        })
    }

    async cadastrarNovoPadrao(req, res) {
        let { caixa, idUsuario } = req.body

        let caixaFormatado = limparDados(caixa);

        try{
            await caixaDao.cadastrarNovoPadrao(caixaFormatado, idUsuario).then(response => {
                return res.status(200).json({ falha: false, dados: { caixa: response } })
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async visualizarTodos(req, res){
        let { page, size } = req.query

        await caixaDao.visualizarTodos(page, size).then(consulta => {
            res.status(200).json(consulta)
        })
    }

    async visualizarTodosNovoPadrao(req, res){
        let {pagina, itensPorPagina} = req.query

        try{
            let filtro = req.query.filtro || null

            let caixas = await caixaDao.visualizarTodosNovoPadrao(pagina, itensPorPagina, filtro)
            let total = await caixaDao.contarCaixas(filtro)

            return res.status(200).json({ falha: false, dados: {total, caixas } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async visualizarFiltroAvancado(req, res) {
        let {pagina, itensPorPagina} = req.query

        try {
            let filtro = req.query.filtro || null

            let caixas = await caixaDao.visualizarFiltroAvancado(pagina, itensPorPagina, filtro)
            let total = await caixaDao.contarCaixasFiltroAvancado(filtro)

            return res.status(200).json({falha: false, dados: {total, caixas}})
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async visualizarCaixa(req, res){
        let { id } = req.params

        try{

            let caixa = await caixaDao.visualizarCaixa(id)

            return res.status(200).json({ falha: false, dados: { caixa: caixa[0] } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async editar(req, res){
        let caixa = req.body.caixa
        let idUsuario = req.body.idUsuario
        await caixaDao.editar(caixa, idUsuario).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async editarNovoPadrao(req, res) {
        let { caixa, idUsuario} = req.body

        let caixaFormatado = limparDados(caixa);

        try {
            await caixaDao.editarNovoPadrao(caixaFormatado, idUsuario).then(response => {
                return res.status(200).json({falha: false, dados: {caixa: response}})
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({falha: true, erro: error})
        }
    }

    async deletar(req, res){
        let idCaixa = req.params.id

        await caixaDao.deletar(idCaixa).then(resposta => {
            res.status(200).json(resposta)
        })
    }

    async deletarNovoPadrao(req, res) {
        let idCaixa = req.params.id
        let { idUsuario } = req.query

        try{
            await caixaDao.deletarNovoPadrao(idCaixa, idUsuario)

            return res.status(200).json({ falha: false, dados: { idCaixa } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }

    }

    async buscarRelatorio(req, res){

        let {data_inicio, data_fim } = req.query

        await caixaDao.buscarRelatorio(data_inicio, data_fim).then(resp => {
            res.status(200).json(resp)
        })
    }

    async buscarRelatorioNovoPadrao(req, res) {
        let {data_inicio, data_fim } = req.query

        try{
            let resp = await caixaDao.buscarRelatorio(data_inicio, data_fim)

            return res.status(200).json({ falha: false, dados: { caixas: resp } })
        }catch(error){
            console.log(error)
            return res.status(500).json({ falha: true, erro: error})
        }
    }

    async visualizarBusca(req, res){
        let { busca } = req.query

        await caixaDao.visualizarBusca(busca).then(consulta => {
            res.status(200).json(consulta)
        })
    }
}

module.exports = new CaixaController()