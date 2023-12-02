const router = require('express').Router();
const jwt = require('jsonwebtoken')
//models
const Usuario = require('../models/Usuario')
const authhelper = require('../helpers/auth');

//rota inicial
router.get('/', (req,res) => {
    res.status(200).json({msg: "rota para registrar e login =)"})
})

//registrar
router.post('/registrar', authhelper.verifDados, async(req, res) => {
    const {nome, senha} = req.body
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
//registar admin
router.post('/admin', authhelper.verifDados, authhelper.verifAdmin, async (req, res) =>{
    const {nome, senha} = req.body
    //verificar se usuario existe
    const usuarioexistente = await Usuario.buscar(nome)
    if (usuarioexistente) {
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    //verificar se o nome contém admin
    if(!nome.includes('admin')){
        return res.status(422).json({msg: `o nome precisa ter 'admin' para se tornar um admin`})
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
router.post("/login", authhelper.verifDados, async(req, res) => {
    const {nome, senha} = req.body
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

//usuario excluir sua conta 
router.delete("/excluirMinhaConta", authhelper.veriftoken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const id= decoded.id
    try{
        const usuario = await Usuario.excluir(id)
        return res.status(200).json({msg: "Sua conta foi excluida.", usuario: usuario});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})
//admin excluir qqlr um
router.delete("/excluir/:nome", authhelper.verifAdmin, async(req, res) => {
    const nome = req.params.nome
    const usuario = await Usuario.buscar(nome)
    if(!usuario){
        return res.status(404).json({msg:'usuario nao encontrado'})
    }
    try{
        const removido = await Usuario.excluirNome(nome)
        return res.status(200).json({msg: "Admin EXCLUIU essa conta", removido: removido});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})


//privado - apenas para verificar o token funcionando
router.get("/:id", authhelper.veriftoken, async (req, res) => {
    const id = req.params.id
    const user = await Usuario.buscarId(id)
    if(!user){
        return res.status(404).json({msg:'usuario nao encontrado'})
    }
    res.status(200).json({user})

    
})

module.exports = router