const mongoose = require('mongoose')

const TreinadorSchema = new mongoose.Schema({
  nome: String,
  level: Number,
  pokemons: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }
  ],
});

const PokemonSchema = new mongoose.Schema({
  nome: String,
  tipo: String,
  numero: Number,
  habilidades: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Habilidade' }
  ],
});

const HabilidadeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nome: String,
  descricao: String,
  efeito: String,
  level: Number,
});

const Habilidade = mongoose.model('Habilidade', HabilidadeSchema);
const Pokemon = mongoose.model('Pokemon', PokemonSchema);
const Treinador = mongoose.model('Treinador', TreinadorSchema);


module.exports = {
    Treinador,
    Pokemon,
    Habilidade,
}
