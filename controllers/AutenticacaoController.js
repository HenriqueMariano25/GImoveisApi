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

    const token = jwt.sign(payload, "B+AGiLydKFtOnVbQAzL1cWhqLoqy+WtpQnPOYouWiKSYMpM9Qi05+x7vu9n2XvaveVNw3amYjuG95vWqccLEf/NlWynW5pM94/eDEFOqLsVnq65zTbpgk4yjrYl5q8aqZK2uJSx6+lDIL4DE3cp5KywhnnOyemz296Lve86v6zAMamBfbDX4YE7WJdfc7\n" +
        "p7slLIBlw0tm52mFaxuAgKbaDDDhswiqQ2gwq5W8DgeR4xw0mat7NmR+J2PLd//JTaSsZPcyO3kOwc+E6QN4NHU3HVaVhk0aYFGzihDzQbSct9A/KNTF8JZjWIN8jYZHR9fsxVgBLhfGoDoC+Q85KaKRQ==")
    return token
}



module.exports = new AutenticacaoController()
