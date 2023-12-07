const router = require('express').Router();
const jwt = require('jsonwebtoken')

const Pokemon = require('../models/Pokemon');
const authhelper = require('../helpers/auth');

router.get('/', (req,res) => {
    res.status(200).json({msg: "rota p Pokemon, Treinador e Habilidades"})
})

router.post('/criarTreinador', authhelper.veriftoken, async (req , res) => {
    const nome = req.body;
    if(!nome) {
        return res.status(422).json({msg: 'erro -> digite um nome'})
    }
    treinadorexistente = Pokemon.buscarTreinadorNome(nome);
    if(treinadorexistente){
        return res.status(422).json({msg: 'utilize outro nome...'})
    }
    try{
        let treinador = Pokemon.salvarTreinador(nome);
        res.status(201).json({msg: 'Treinador Criado! ', treinador: treinador}) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

module.exports = router