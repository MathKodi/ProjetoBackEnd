require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = express()

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({msg: "Bem vindo ao API"})
})

//registrar
app.post('/auth/registrar', async(req, res) => {
    
})

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.ucgj8xz.mongodb.net/`).then(() => {
    app.listen(3000)
    console.log('conectou ao banco')
}).catch((err) => console.log(err))

