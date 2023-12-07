const router = require('express').Router();
const jwt = require('jsonwebtoken')
const {Treinador, Pokemon, Habilidade} = require('../models/Pokemon');
const authhelper = require('../helpers/auth');

// rota inicial
router.get('/', (req,res) => {
    res.status(200).json({msg: "rota p Pokemon, Treinador e Habilidades"})
})

// criar habilidade
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