const mongoose = require('mongoose')

const Usuario = mongoose.model('Usuario', {
    nome: String,
    senha: String
})

module.exports = {
    Usuario,
}
