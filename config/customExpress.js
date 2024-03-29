const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const { estragiasAutenticacao } = require('../config/estrategiasAutenticacao')

module.exports = () => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors())
    app.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")));

    consign()
        .include('routers')
        .into(app)

    return app
}
