const router = require('express').Router();
const jwt = require('jsonwebtoken')
//models
const Usuario = require('../models/Usuario')
const authhelper = require('../helpers/auth')

//registrar
router.post('/registrar', async(req, res) => {
    const {nome, senha} = req.body

    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'erro -> digite uma senha'})
    }

    //verificar se usuario existe
    const usuarioexistente = await Usuario.buscar(nome)
    if (usuarioexistente) {
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    try{
        let aux = await Usuario.salvar(nome, senha)
        res.status(201).json({msg: 'Registrado! ', aux: aux}) 
        
        
    } catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }

})

//login
router.post("/login", async(req, res) => {
    const {nome, senha} = req.body

    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    if(!senha) {
        return res.status(422).json({msg: 'erro -> digite uma senha'})
    }
    //verificar se usuario existe
    const usuarioexistente = await Usuario.buscar(nome)

    if (!usuarioexistente) {
        return res.status(422).json({msg: 'usuario nao encontrado'})
    }
    //verificar senha
    if(senha != usuarioexistente.senha) {
        return res.status(422).json({msg: 'senha invalida'})
    }
    try{
        const secret = process.env.SECRET
        if(nome.includes('admin')){
            const token = jwt.sign(
            {
                admin: true,
                nome: nome,
                id: usuarioexistente._id
            },
            secret,
            )
            res.status(200).json({msg: 'login realizado com sucesso - Admin ', nome, token})
        } else{
            const token = jwt.sign(
                {
                    nome: nome,
                    id: usuarioexistente._id
                },
                secret,
                )
                res.status(200).json({msg: 'login realizado com sucesso - Usuario ', nome, token})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})



//privado
router.get("/:id", authhelper.veriftoken, async (req, res) => {
    const id = req.params.id
    const user = await Usuario.buscar(id, '-senha')
    if(!user){
        return res.status(404).json({msg:'usuario nao encontrado'})
    }
    res.status(200).json({user})

    
})

module.exports = router