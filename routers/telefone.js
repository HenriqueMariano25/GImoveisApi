const TelefoneController = require('../controllers/TelefoneController')

module.exports = app => {
    app.get('/tipos_telefones',(req,res) => {
        TelefoneController.visualizarTiposTelefones(res)
    })
    app.get('/telefones', (req, res) => {
        TelefoneController.telefones(req,res)
    })
}
