const mongoose = require('mongoose')

const Treinador = mongoose.model('Treinador', {
    nome: String,
    idade: Number,
    cidade: String,
    pokemons: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }
    ],
  });
  
  const Pokemon = mongoose.model('Pokemon', {
    nome: String,
    tipo: String,
    numero: Number,
    habilidades: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Habilidade' }
    ],
  });
  
  const Habilidade = mongoose.model('Habilidade', {
    id: { type: Number, required: true, unique: true },
    nome: String,
    descricao: String,
  });
  
module.exports = {
    Treinador,
    Pokemon,
    Habilidade,
}
