const jwt = require('jsonwebtoken')

class AutenticacaoController {
    login(req, res){
        const token = criarTokenJWT(req.user)
        res.set('Authorization', token)
        res.status(200).send({'usuario':req.user, 'Authorization': token})
    }
    logout(req, res){
        res.status(200).send("Logout realizado com sucesso")
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