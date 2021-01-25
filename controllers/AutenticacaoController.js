const jwt = require('jsonwebtoken')
const axios = require('axios')

class AutenticacaoController {
    async login(req, res){
        const token = criarTokenJWT(req.user)
        let dolar = await dolarHoje()
        await res.status(200).send({'usuario':req.user, 'Authorization': token, 'dolar': dolar})
    }
    logout(req, res){
        res.status(200).send("Logout realizado com sucesso")
    }
}

async function dolarHoje(){
    return new Promise(resolve => {
        axios.get(`https://economia.awesomeapi.com.br/all/USD-BRL`).then(response => {
            let dolar = parseFloat(response.data.USD.high).toFixed(2)
            resolve(dolar)
        })
    })

}


function criarTokenJWT(usuario){
    const payload = {
        id: usuario.id
    }

    const token = jwt.sign(payload, process.env.CHAVE_JWT)
    return token
}



module.exports = new AutenticacaoController()