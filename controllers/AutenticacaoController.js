const jwt = require('jsonwebtoken')
const axios = require('axios')
const usuarioDao = require("../dao/usuarioDao");

class AutenticacaoController {
    async login(req, res){
        const token = criarTokenJWT(req.user)
        await res.status(200).send({'usuario':req.user, 'Authorization': token})
    }
    logout(req, res){
        res.status(200).send("Logout realizado com sucesso")
    }


    async loginNovoPadrao(req, res) {
        const token = criarTokenJWT(req.user)

        await res.status(200).send({token: token})
    }
    async buscarUsuario(req, res){
        const token = req.body.token || req.query.token || req.headers["authorization"].split(" ")[1]
            try{
                const decoded = jwt.verify(token, process.env.CHAVE_JWT)

                req.user = decoded
                let idUsuario = req.user.id

                let usuario = await usuarioDao.visualizar(idUsuario)

                return res.status(200).json(usuario)
            }catch(error){
                console.log(error)
                return res.status(500).json({ falha: true, erro: error})
            }
    }
}

function criarTokenJWT(usuario){
    const payload = {
        id: usuario.id
    }

    const token = jwt.sign(payload, process.env.CHAVE_JWT)
    return token
}



module.exports = new AutenticacaoController()
