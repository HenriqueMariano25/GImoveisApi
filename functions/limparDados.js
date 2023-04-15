module.exports = function limparDados(objeto){
    console.log(objeto)
    console.log("objeto")

    let novoObjeto = Object.assign({}, objeto)

    for(let k of Object.keys(objeto)){
        if(novoObjeto[k] !== null && typeof novoObjeto[k] === 'string')
            novoObjeto[k] = novoObjeto[k].trim()

        if(novoObjeto[k] === '')
            novoObjeto[k] = null
    }

    return novoObjeto
}