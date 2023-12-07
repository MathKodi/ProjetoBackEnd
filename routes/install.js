const express = require("express");
const router = express.Router();
const {Habilidade, Pokemon, Treinador} = require('../models/Pokemon')
const Usuario = require('../models/Usuario')

router.get('/', async (req, res) =>{
    try{
        const nome = "profadmin"
        const senha = "deusmeajuda"

        let admin = await Usuario.salvar(nome, senha)

        const habilidades = await Habilidade.create([
            { id: 1, nome: 'Chama Ardente', descricao: 'Ataque de fogo intenso', efeito: 'Queima o oponente', level: 1 },
            { id: 2, nome: 'Rajada de Folhas', descricao: 'Dispara uma rajada de folhas afiadas', efeito: 'Corta a defesa do oponente', level: 2 },
            { id: 3, nome: 'Raio Trovejante', descricao: 'Lança um raio elétrico poderoso', efeito: 'Paralisa o oponente', level: 3 },
            { id: 4, nome: 'Jato de Água', descricao: 'Lança um jato de água com alta pressão', efeito: 'Diminui a velocidade do oponente', level: 4 },
            { id: 5, nome: 'Garras Afiadas', descricao: 'Ataca com garras afiadas', efeito: 'Aumenta a chance de acerto crítico', level: 5 },
            { id: 6, nome: 'Vento Cortante', descricao: 'Cria uma lâmina de vento cortante', efeito: 'Ignora a defesa do oponente', level: 6 },
            { id: 7, nome: 'Terremoto', descricao: 'Provoca um terremoto poderoso', efeito: 'Derruba o oponente', level: 7 },
            { id: 8, nome: 'Escudo de Terra', descricao: 'Cria um escudo de terra para se proteger', efeito: 'Aumenta a defesa do usuário', level: 8 },
            { id: 9, nome: 'Ilusão Hipnótica', descricao: 'Cria ilusões para confundir o oponente', efeito: 'Diminui a precisão do oponente', level: 9 },
            { id: 10, nome: 'Explosão Solar', descricao: 'Libera uma explosão de energia solar', efeito: 'Causa dano em área', level: 10 },
            { id: 11, nome: 'Vento Cortante', descricao: 'Cria uma lâmina de vento cortante', efeito: 'Ignora a defesa do oponente', level: 11 },
            { id: 12, nome: 'Confusão Mental', descricao: 'Causa confusão mental no oponente', efeito: 'Oponente pode atacar a si mesmo', level: 12 },
            { id: 13, nome: 'Mergulho Profundo', descricao: 'Realiza um mergulho poderoso', efeito: 'Aumenta a defesa do usuário', level: 13 },
            { id: 14, nome: 'Chicote de Vinhas', descricao: 'Ataca com um chicote de vinhas afiadas', efeito: 'Causa dano e diminui a velocidade do oponente', level: 14 },
            { id: 15, nome: 'Gelo Cortante', descricao: 'Dispara lâminas de gelo afiadas', efeito: 'Congela o oponente', level: 15 },
        ]);
  
        const pokemons = await Pokemon.create([
            { nome: 'Charmander', tipo: 'Fogo', numero: 4, habilidades: [habilidades[0], habilidades[2], habilidades[5]] },
            { nome: 'Bulbasaur', tipo: 'Planta', numero: 1, habilidades: [habilidades[1], habilidades[4], habilidades[6]] },
            { nome: 'Squirtle', tipo: 'Água', numero: 7, habilidades: [habilidades[3], habilidades[2], habilidades[7]] },
            { nome: 'Pikachu', tipo: 'Elétrico', numero: 25, habilidades: [habilidades[2], habilidades[4], habilidades[8]] },
            { nome: 'Machop', tipo: 'Lutador', numero: 66, habilidades: [habilidades[4], habilidades[0], habilidades[9]] },
            { nome: 'Vulpix', tipo: 'Fogo', numero: 37, habilidades: [habilidades[0], habilidades[5], habilidades[7]] },
            { nome: 'Geodude', tipo: 'Pedra', numero: 74, habilidades: [habilidades[6], habilidades[7], habilidades[2]] },
            { nome: 'Abra', tipo: 'Psíquico', numero: 63, habilidades: [habilidades[9], habilidades[8], habilidades[3]] },
            { nome: 'Jigglypuff', tipo: 'Fada', numero: 39, habilidades: [habilidades[4], habilidades[7], habilidades[1]] },
            { nome: 'Meowth', tipo: 'Normal', numero: 52, habilidades: [habilidades[5], habilidades[9], habilidades[0]] },
            { nome: 'Eevee', tipo: 'Normal', numero: 133, habilidades: [habilidades[5], habilidades[9], habilidades[11]] },
            { nome: 'Gyarados', tipo: 'Água', numero: 130, habilidades: [habilidades[3], habilidades[7], habilidades[12]] },
            { nome: 'Alakazam', tipo: 'Psíquico', numero: 65, habilidades: [habilidades[10], habilidades[8], habilidades[13]] },
            { nome: 'Machamp', tipo: 'Lutador', numero: 68, habilidades: [habilidades[4], habilidades[0], habilidades[14]] },
            { nome: 'Lapras', tipo: 'Água', numero: 131, habilidades: [habilidades[3], habilidades[5], habilidades[10]] },
        ]);
  
      const treinadores = await Treinador.create([
            { nome: 'May', level: 14, pokemons: [pokemons[0], pokemons[5], pokemons[9]] },
            { nome: 'Dawn', level: 16, pokemons: [pokemons[2], pokemons[4], pokemons[8]] },
            { nome: 'Cynthia', level: 20, pokemons: [pokemons[6], pokemons[3], pokemons[7]] },
            { nome: 'N', level: 18, pokemons: [pokemons[1], pokemons[13], pokemons[14]] },
            { nome: 'Red', level: 25, pokemons: [pokemons[11], pokemons[12], pokemons[10]] },
      ]);
  
      res.status(200).json({ message: 'Banco de dados instalado com sucesso - Admin Criado -> nome: profadmin, senha: deusmeajuda', treinadores, pokemons, habilidades });
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: 'erro no servidor ao instalar o banco de dados'})
    }
})

module.exports = router
