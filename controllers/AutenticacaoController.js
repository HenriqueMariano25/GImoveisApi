const jwt = require('jsonwebtoken')
const axios = require('axios')

class AutenticacaoController {
    async login(req, res){
        const token = criarTokenJWT(req.user)
        await res.status(200).send({'usuario':req.user, 'Authorization': token})
    }
    logout(req, res){
        res.status(200).send("Logout realizado com sucesso")
    }
}

function criarTokenJWT(usuario){
    const payload = {
        id: usuario.id
    }

    const token = jwt.sign(payload, process.env.NODE_ENV === "production" ? ".env.production.CHAVE_JWT" : ".env.CHAVE_JWT")
    return token
}



module.exports = new AutenticacaoController()
