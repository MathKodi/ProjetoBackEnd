const mongoose = require('mongoose')

const Usuario = mongoose.model('Usuario', {
    nome: String,
    senha: String
})

const salvar = async (nome, senha) => {
    const aux = await Usuario.create({ nome, senha})
    return aux;
}

const atualizar = async (id, nome) => {
    const aux = await Usuario.findByIdAndUpdate(id, {nome: nome})
    return aux;
}

const excluir = async(id) => {
    const aux = await Usuario.findByIdAndDelete({_id: id})
    return aux;
}

const buscarId = async(id) => {
    const aux = await Usuario.findOne({_id: id})
    return aux;
}

const buscar = async(nome) => {
    const aux = await Usuario.findOne({nome: nome})
    return aux;
}

module.exports = {
    Usuario,
    salvar,
    atualizar,
    excluir,
    buscarId,
    buscar,
}
