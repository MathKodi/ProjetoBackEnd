const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = {
    veriftoken(req, res, next) {
        const authHeader = req.headers['authorization']
        if(!authHeader) {
            return res.status(401).json({msg:'Token nao inserido'})
        }
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
    },
    verifAdmin(req, res, next) {
        const authHeader = req.headers['authorization']
        if(!authHeader) {
            return res.status(401).json({msg:'Token nao inserido'})
        }
        const token = authHeader && authHeader.split(" ")[1]
        if(!token){
            return res.status(401).json({msg:'Acesso negado'})
        }
        try{
            const secret = process.env.SECRET
            const decoded = jwt.verify(token, secret)
            if(!decoded.admin){
                res.status(400).json({msg: 'Acesso negado -> Não é um Admin'})
            } else{
                next()
            }
        } catch(error){
            res.status(400).json({msg: 'token invalido'})
        }
    },
    verifDados(req, res, next){
        const { nome, senha} = req.body
        if(!nome) {
            return res.status(422).json({msg: 'erro -> digite um nome'})
        }
        if(!senha) {
            return res.status(422).json({msg: 'erro -> digite uma senha'})
        }
        next()
    },
    verifTreinador(req, res, next){
        const {nome, level} = req.body;
        if(!nome) {
            return res.status(422).json({msg: 'erro -> digite um nome'})
        }
        if(!level) {
            return res.status(422).json({msg: 'erro -> digite um level'})
        }
        next()
    },
    verifPokemon(req, res, next){
        const {nome, tipo, numero} = req.body;
        if(!nome) {
            return res.status(422).json({msg: 'erro -> digite um nome'})
        }
        if(!tipo) {
            return res.status(422).json({msg: 'erro -> digite um tipo'})
        }
        if(!numero) {
            return res.status(422).json({msg: 'erro -> digite um numero'})
        }
        next()
    },
    verifHabilidade(req, res, next){
        const {id, nome, descricao, efeito, level} = req.body;
        if(!nome) {
            return res.status(422).json({msg: 'erro -> digite um nome'})
        }
        if(!id) {
            return res.status(422).json({msg: 'erro -> digite um id'})
        }
        if(!descricao) {
            return res.status(422).json({msg: 'erro -> digite uma descricao'})
        }
        if(!efeito) {
            return res.status(422).json({msg: 'erro -> digite um efeito'})
        }
        if(!level) {
            return res.status(422).json({msg: 'erro -> digite um level'})
        }
        next()
    },
    verifAttTreinador(req, res, next) {
        const {id, nome, level} = req.body
        if(!id){
            return res.status(404).json({msg:'Insira um id'})
        }
        if(!nome){
            return res.status(404).json({msg:'Insira um nome'})
        }
        if(!level){
            return res.status(404).json({msg:'Insira um level'})
        }
        next()
    },
}