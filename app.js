require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = express()

//responde json
app.use(express.json())

//models
const Usuario = require('./models/Usuario')

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({msg: "Bem vindo ao API"})
})

//registrar
app.post('/auth/registrar', async(req, res) => {
    const {nome, senha} = req.body

    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'erro -> digite uma senha'})
    }

    //verificar se usuario existe
    const usuarioexistente = await Usuario.findOne({nome: nome})

    if (usuarioexistente) {
        return res.status(422).json({msg: 'utilize outro nome...'})
    }

    //criar usuario
    const usuario = new Usuario({
        nome,
        senha,
    })
    try{
        await usuario.save()
        res.status(201).json({msg: 'usuario criado'})
    } catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }

})

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.ucgj8xz.mongodb.net/`).then(() => {
    app.listen(3000)
    console.log('conectou ao banco')
}).catch((err) => console.log(err))

