module.exports = app => {
    app.get('/', (req,res) => {
        res.send({oi:"Hello World!"})
    })
}
