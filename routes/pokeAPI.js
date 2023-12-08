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
    // #swagger.description = 'Rota para criar uma habilidade, precisa do token de admin'
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
    // #swagger.description = 'Rota para criar um Pokemon, precisa ter o token de admin'
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
    // #swagger.description = 'Rota para criar um Treinador, precisa ter o token de usuario'
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
// excluir Habilidade
router.delete("/excluirHabilidade/:id", authhelper.verifAdmin, async(req, res) => {
    // #swagger.description = 'Rota para excluir uma Habilidade, precisa ter o token de admin'
    const id = req.params.id
    if(!id){
        return res.status(404).json({msg:'id não informado'})
    }
    try{
        const habilidade = await Habilidade.findOne({id: id})
        if(!habilidade){
            return res.status(404).json({msg:'id da habilidade não encontrado'})
        }
        const removido = await Habilidade.findOneAndDelete({id: id})
        return res.status(200).json({msg: "Habilidade Excluido.", removido: removido});
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// excluir Pokemon
router.delete("/excluirPokemon/:id", authhelper.verifAdmin, async(req, res) => {
    // #swagger.description = 'Rota para excluir um Pokemon, precisa ter o token de admin'
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
    // #swagger.description = 'Rota para excluir um Treinador, precisa ter o token de admin'
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

// atualizar Habilidade, mudar 
router.put('/attHabilidade/', authhelper.verifAdmin, authhelper.verifAttHabilidade,async(req, res) =>{
    // #swagger.description = 'Rota que atualiza as habilidades, necessita do req.body e token de admin, atualiza o nome, descricao, efeito e nivel'
    try{
        const {id, nome, descricao, efeito, nivel} = req.body
        att = await Habilidade.findByIdAndUpdate(id, {nome: nome, descricao: descricao, efeito: efeito, nivel: nivel})
        return res.status(200).json({msg: "Habilidade foi alterado", att: att});
    }  
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// atualizar Pokemon - Adicionar habilidade e mudar nome, tipo, numero,
router.put('/attPokemon/', authhelper.verifAdmin, authhelper.verifAttPokemon,async(req, res) =>{
    // #swagger.description = 'Rota que atualiza o pokemon, neecssita do req.body e token de admin, atualiza o nome, numero, tipo, e habilidades que possui'
    try{
        const {id, nome, tipo, numero, habilidades} = req.body
        if(!habilidades){
            att = await Pokemon.findByIdAndUpdate(id, {nome: nome, tipo: tipo, numero: numero})
            return res.status(200).json({msg: "Pokemon foi alterado", att: att});
        } else{
            att2 = await Pokemon.findByIdAndUpdate(id, {nome: nome, tipo: tipo, numero: numero, habilidades: [habilidades]})
            return res.status(200).json({msg: "Pokemon foi alterado", att2: att2});
        }
    }  
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})

// atualizar Treinador - Adicionar Pokemon e mudar nome
router.put('/attTreinador/', authhelper.verifAdmin, authhelper.verifAttTreinador ,async(req, res) =>{
    // #swagger.description = 'Rota que atualiza o treinador, necessita do req.body e token de admin, atualiza o nome, level e os pokemons que possui.'
    try{
        const {id, nome, pokemonId, level} = req.body
        if(!pokemonId){
            att = await Treinador.findByIdAndUpdate(id, {nome: nome, level: level})
            return res.status(200).json({msg: "Seu Treinador foi alterado", att: att});
        } else {
            att2 = await Treinador.findByIdAndUpdate(id, {nome: nome, level: level, pokemons: [pokemonId]})
            return res.status(200).json({msg: "Seu Treinador foi alterado", att2: att2});
        }
        
    }  
    catch(error){
        console.log(error)
        res.status(500).json({msg: 'erro no servidor'})
    }
})
// Rota para listar Habilidades
router.get('/habilidades', authhelper.verifAdmin,async (req, res) => {
    // #swagger.description = 'Rota que lista as habilidades com limite, com query limite e pagina, limite precisa ser 5, 10 ou 30. Precisa do token de admin'
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    if (limite === 5 || limite === 10 || limite === 30){
        const habilidades = await Habilidade.find()
            .skip((pagina - 1) * limite)
            .limit(limite);
  
        res.json(habilidades); 
    } else{
        res.status(404).send({error: 'Limite inválido. Os valores possíveis são 5, 10 ou 30.'});
    }
    
  });
  
  // Rota para listar Pokemons
  router.get('/pokemons', authhelper.verifAdmin,async (req, res) => {
    // #swagger.description = 'Rota que lista os pokemons com limite, com query limite e pagina, limite precisa ser 5, 10 ou 30. Precisa do token de admin'
    const limite = parseInt(req.query.limite)  || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    
    if (limite === 5 || limite === 10 || limite === 30) {
        const pokemons = await Pokemon.find()
            .skip((pagina - 1) * limite)
            .limit(limite);
        res.json(pokemons);
      } else {
        res.status(404).send({error: 'Limite inválido. Os valores possíveis são 5, 10 ou 30.'});
        }
    });

// Rota para listar Treinadores
router.get('/treinadores', authhelper.veriftoken,async (req, res) => {
    // #swagger.description = 'Rota que lista os treinadores com limite, com query limite e pagina, limite precisa ser 5, 10 ou 30'
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
  
    if (limite === 5 || limite === 10 || limite === 30) {
      const treinadores = await Treinador.find()
        .skip((pagina - 1) * limite)
        .limit(limite);
  
      res.json(treinadores);
    } else {
      res.status(404).send({error: 'Limite inválido. Os valores possíveis são 5, 10 ou 30.'});
    }
  });

// lógica de negócio - ver quais habilidades o treinador consegue usar dos seus pokemons
router.get('/habilidadesDisponiveis/:idTreinador', authhelper.veriftoken,async (req, res) => {
    // #swagger.description = 'Rota de Lógica de negócio, mostra quais habilidades o treinador consegue usar dos seus pokemons'
    try {
      const idTreinador = req.params.idTreinador;
      const treinador = await Treinador.findById(idTreinador);
      if (!treinador) {
        return res.status(404).json({ msg: 'Treinador não encontrado' });
      }
      const idsPoke = treinador.pokemons
      const idhab = []
      for (const id of idsPoke) {
        const pokemon = await Pokemon.findById(id)
        idhab.push(pokemon.habilidades)
      }
      const habilidadesDisponiveis = [];
      for (const id2 of idhab) {
        const habilidade = await Habilidade.findById(id2)
        if (treinador.level >= habilidade.level) {
          habilidadesDisponiveis.push(habilidade);
        }
      }
  
      res.json({ msg: 'Habilidades disponíveis para o Treinador usar dos seus pokemons...: ', habilidadesDisponiveis });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Erro no servidor' });
    }
});
// lógica de negócio - ver quais pokemons o treinador possui
router.get('/pokemons/:id', authhelper.veriftoken,async (req, res) => {
    // #swagger.description = 'Rota de Lógica de negócio, mostra quais pokemons o treinador possui'
    try{
      const treinador = await Treinador.findById(req.params.id)
  
      if (!treinador) {
        res.status(404).json({message: 'Treinador não encontrado',})
      }
      const user = treinador.nome
      const ids = treinador.pokemons
  
      const nomes = []
      for (const id of ids) {
        const pokemon = await Pokemon.findById(id)
        nomes.push(pokemon.nome)
      }
  
      res.json({msg: 'pokemons do treinador', user, nomes})
    } catch(error){
      console.log(error)
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  })
// lógica de negócio - ver quais habilidades o pokemon possui
router.get('/habilidadesPokemon/:id', authhelper.veriftoken,async (req, res) => {
    // #swagger.description = 'Rota de Lógica de negócio, mostra quais habilidades o pokemon possui'
    try{
      const pokemon = await Pokemon.findById(req.params.id)
  
      if (!pokemon) {
        res.status(404).json({message: 'Pokemon não encontrado',})
      }
      const ids = pokemon.habilidades
      const poke = pokemon.nome
      const nomes = []
      for (const id of ids) {
        const habilidade = await Habilidade.findById(id)
        nomes.push(habilidade.nome)
      }
  
      res.json({msg: 'habilidades do Pokemon', poke, nomes})
    } catch(error){
      console.log(error)
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  })

module.exports = router