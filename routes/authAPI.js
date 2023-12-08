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
    const usuarioexistente = await Usuario.findOne({nome: nome})
    if (usuarioexistente) {
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    try{
        let aux = await Usuario.create({nome, senha})
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
    const usuarioexistente = await Usuario.findOne({nome: nome})
    if (usuarioexistente) {
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    //verificar se o nome contém admin
    if(!nome.includes('admin')){
        return res.status(422).json({msg: `o nome precisa ter 'admin' para se tornar um admin`})
    }
    try{
        let aux = await Usuario.create({nome, senha})
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

//usuario excluir sua conta !! perguntar p sor se outro usuario consegue excluir outro usuario
router.delete("/excluirMinhaConta", authhelper.veriftoken, async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const id = decoded.id
    try{
        const usuario = await Usuario.findByIdAndDelete({_id: id})
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
    const usuario = await Usuario.findOne({nome: nome})
    if(!nome){
        return res.status(404).json({msg:'nome não informado'})
    }
    if(!usuario){
        return res.status(404).json({msg:'usuario nao encontrado'})
    }
    try{
        const removido = await Usuario.findOneAndDelete({nome: nome})
        return res.status(200).json({msg: "Admin EXCLUIU essa conta", removido: removido});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

//usuario alterar seu nome
router.put('/attNome/:nome', authhelper.veriftoken, async(req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const id = decoded.id
    const nomeparams = req.params.nome
    if(!nomeparams){
        return res.status(404).json({msg:'nome não informado para alterar'})
    }
    try{
        att = await Usuario.findByIdAndUpdate(id, {nome: nome})
        return res.status(200).json({msg: "Seu nome foi alterado", att: att});
    }  
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }

})
//usuario alterar sua senha
router.put('/attSenha/:senha', authhelper.veriftoken, async(req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const id = decoded.id
    const senhaparams = req.params.senha
    if(!senhaparams){
        return res.status(404).json({msg:'senha não informada para alterar'})
    }
    try{
        att = await Usuario.findByIdAndUpdate(id, {senha: senha})
        return res.status(200).json({msg: "Sua senha foi alterado", att: att});
    }  
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }

})
//admin alterar dados dos outros
router.put('/attUsuario/:id/:nome/:senha', authhelper.verifAdmin, async(req, res) =>{
    const id = req.params.id
    const nome = req.params.nome
    const senha = req.params.senha
    try{
        att = await Usuario.findByIdAndUpdate(id, {nome: nome, senha: senha})
        return res.status(200).json({msg: "Admin alterou esse usuario...", att: att});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

//listar usuarios
router.get('/usuarios', authhelper.verifAdmin,async (req, res) => {
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    if (limite === 5 || limite === 10 || limite === 30){
        const usuarios = await Usuario.find()
            .skip((pagina - 1) * limite)
            .limit(limite);
  
        res.json(usuarios); 
    } else{
        res.status(404).send({
            error: 'Limite inválido. Os valores possíveis são 5, 10 ou 30.'
        });
    }
    
  });


module.exports = router