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

//login
app.post("/auth/login", async(req, res) => {
    const {nome, senha} = req.body

    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'erro -> digite uma senha'})
    }
    //verificar se usuario existe
    const usuarioexistente = await Usuario.findOne({nome: nome})

    if (!usuarioexistente) {
        return res.status(422).json({msg: 'usuario nao encontrado'})
    }
    //verificar senha
    if(senha != usuarioexistente.senha) {
        return res.status(422).json({msg: 'senha invalida'})
    }
    try{
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: usuarioexistente._id
            },
            secret,
        )
        res.status(200).json({msg: 'Autenticacao realizada', token})
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

//privado
app.get("/usuario/:id",veriftoken, async (req, res) => {
    const id = req.params.id
    const user = await Usuario.findById(id, '-senha')
    if(!user){
        return res.status(404).json({msg:'usuario nao encontrado'})
    }
    res.status(200).json({user})

    
})

function veriftoken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({msg:'Acesso negado'})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)

        next()

    } catch(error){
        res.status(400).json({msg: 'token invalido'})
    }
}

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.ucgj8xz.mongodb.net/`).then(() => {
    app.listen(3000)
    console.log('conectou ao banco')
}).catch((err) => console.log(err))

