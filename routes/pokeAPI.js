const router = require('express').Router();
const jwt = require('jsonwebtoken')

const Pokemon = require('../models/Pokemon');
const authhelper = require('../helpers/auth');

router.get('/', (req,res) => {
    res.status(200).json({msg: "rota p Pokemon, Treinador e Habilidades"})
})



module.exports = router