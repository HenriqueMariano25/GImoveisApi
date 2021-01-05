const passport = require('passport')
const LocalStrategy = require('passport-local')
const BearerStrategy = require('passport-http-bearer')
const jwt = require('jsonwebtoken')
const { InvalidArgumentError } = require('./erros.js');

const Usuario = require('../models/UsuarioModels')

function verificaUsuario(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError('Usuário ou senha inválidos!');
    }
}

function verificaSenha(password, usuarioPassword) {
    const senhaValida = (password === usuarioPassword)
    if (!senhaValida) {
        throw new InvalidArgumentError('Usuário ou senha inválidos!');
    }
}

passport.use(
    new LocalStrategy({
            usernameField: 'usuario',
            passwordField: 'senha',
            session: false
        },
        async (username, password, done) => {
            try {
                const usuario = await Usuario.buscaPorUsuario(username)
                verificaUsuario(usuario)
                await verificaSenha(password, usuario.senha)
                done(null, usuario)
            } catch (erro) {
                console.log(erro)
                done(erro)
            }
        }
    )
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const payload = jwt.verify(token, process.env.CHAVE_JWT)
                const usuario = await Usuario.buscaPorId(payload.id)
                done(null, usuario)
            } catch (erro) {
                done(erro)
            }
        }
    )
)