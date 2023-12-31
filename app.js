require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//responde json
app.use(express.json())

//rotas da api
const usuarioRotas = require('./routes/authAPI')
app.use("/auth", usuarioRotas)

const pokemonRotas = require('./routes/pokeAPI')
app.use('/pokemon', pokemonRotas)

const installRota = require('./routes/install')
app.use('/install', installRota)

//swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_doc.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//rota inicial
app.get('/', (req,res) => {
    // #swagger.description = 'Rota inicial apenas dando boas vindas ao API'
    res.status(200).json({
        msg: "trabalho de back end - API de Pokemon"
    })
})

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.ucgj8xz.mongodb.net/`).then(() => {
    app.listen(3000)
    console.log('conectou ao banco')
}).catch((err) => console.log(err))

