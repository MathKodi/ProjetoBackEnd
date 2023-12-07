const router = require('express').Router();
const jwt = require('jsonwebtoken')
const {Treinador, Pokemon, Habilidade} = require('../models/Pokemon');
const authhelper = require('../helpers/auth');

// rota inicial
router.get('/', (req,res) => {
    res.status(200).json({msg: "rota p Pokemon, Treinador e Habilidades"})
})

// criar habilidade
router.post('/criarHabilidade', authhelper.verifAdmin, async (req , res) => {
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
    habilidadeIdExistente = await Habilidade.findOne({id: id});
    if(habilidadeIdExistente){
        return res.status(422).json({msg: 'utilize outro id...'})
    }
    try{
        let habilidade = new Habilidade({
            id: id,
            nome: nome,
            descricao: descricao,
            efeito: efeito,
            level: level,
        })
        await habilidade.save()
        res.status(201).json({msg: 'Pokemon Criado! ', habilidade: habilidade}) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// criar pokemon
router.post('/criarPokemon', authhelper.verifAdmin, async (req , res) => {
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
    try{
        let pokemon = new Pokemon({
            nome: nome,
            tipo: tipo,
            numero: numero,
            habilidades: []
        })
        await pokemon.save()
        res.status(201).json({msg: 'Pokemon Criado! ', pokemon: pokemon}) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})


// criar treinador
router.post('/criarTreinador', authhelper.veriftoken, async (req , res) => {
    const {nome, level} = req.body;
    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    if(!level) {
        return res.status(422).json({msg: 'erro -> digite um level'})
    }
    treinadorexistente = await Treinador.findOne({nome: nome});
    if(treinadorexistente){
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    try{
        let treinador = new Treinador({
            nome: nome,
            level: level,
            pokemons: []
        })
        await treinador.save()
        res.status(201).json({msg: 'Treinador Criado! ', treinador: treinador}) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

module.exports = router