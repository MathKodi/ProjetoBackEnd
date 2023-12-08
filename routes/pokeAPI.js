const router = require('express').Router();
const jwt = require('jsonwebtoken')
const {Treinador, Pokemon, Habilidade} = require('../models/Pokemon');
const authhelper = require('../helpers/auth');

// rota inicial
router.get('/', (req,res) => {
    res.status(200).json({msg: "rota p Pokemon, Treinador e Habilidades"})
})

// criar habilidade
router.post('/criarHabilidade', authhelper.verifAdmin, authhelper.verifHabilidade, async (req , res) => {
    const {id, nome, descricao, efeito, level} = req.body;
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
        res.status(201).json({msg: 'Habilidade Criado! ', habilidade: habilidade}) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// criar pokemon
router.post('/criarPokemon', authhelper.verifAdmin, authhelper.verifPokemon,async (req , res) => {
    const {nome, tipo, numero} = req.body;
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
router.post('/criarTreinador', authhelper.veriftoken, authhelper.verifTreinador, async (req , res) => {
    const {nome, level} = req.body;
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
// excluir Pokemon
router.delete("/excluirPokemon/:id", authhelper.verifAdmin, async(req, res) => {
    const id = req.params.id
    if(!id){
        return res.status(404).json({msg:'id não informado'})
    }
    try{
        const pokemon = await Pokemon.findOne({_id: id})
        if(!pokemon){
            return res.status(404).json({msg:'id do pokemon não encontrado'})
        }
        const removido = await Pokemon.findOneAndDelete({_id: id})
        return res.status(200).json({msg: "Pokemon Excluido.", removido: removido});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// excluir Treinador
router.delete("/excluirTreinador/:nome", authhelper.verifAdmin, async(req, res) => {
    const nome = req.params.nome
    if(!nome){
        return res.status(404).json({msg:'nome não informado'})
    }
    try{
        const treinador = await Treinador.findOne({nome: nome})
        if(!treinador){
            return res.status(404).json({msg:'Treinador não encontrado'})
        }
        const removido = await Treinador.findOneAndDelete({nome: nome})
        return res.status(200).json({msg: "Treinador Excluido.", removido: removido});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})
module.exports = router