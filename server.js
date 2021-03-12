// require('dotenv').config()
require('dotenv').config({
    path: process.env.NODE_ENV === "production" ? './.env.production' : './.env'
})
const customExpress = require('./config/customExpress')

const port = process.env.PORT || 3000

const app = customExpress()
app.listen(port, () => {console.log('Aplicação rodando na porta 3000')})
