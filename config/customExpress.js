const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const cors = require('cors')

const { estragiasAutenticacao } = require('../config/estrategiasAutenticacao')

module.exports = () => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    consign()
        .include('routers')
        .into(app)

    return app
}