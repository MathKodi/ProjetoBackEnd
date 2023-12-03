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

const salvarHabilidade = async (id, nome, descricao, efeito, level) => {
  const habilidade = await Habilidade.create({id, nome, descricao, efeito, level})
  return habilidade;
}

const salvarPokemon = async(nome, tipo, numero, habilidades) => {
  const pokemon = await Pokemon.create({nome, tipo, numero, habilidades});
  return pokemon;
}

const salvarTreinador = async (nome) => {
  const treinador = await Treinador.create({nome, level: 1})
  return treinador;
}

const alterarHabilidade = async (id, dados) => {
  const habalt = await Habilidade.findByIdAndUpdate(id, dados)
  return habalt;
}

const alterarPokemon = async (id, dados) => {
  const pokemonalt = await Pokemon.findByIdAndUpdate(id, dados)
  return pokemonalt;
}

const alterarTreinador = async (id, dados) => {
  const treinadoralt = await Treinador.findByIdAndUpdate(id, dados)
  return treinadoralt;
}

const excluirHabilidade = async(id) => {
  const aux = await Habilidade.findByIdAndDelete({_id: id})
  return aux;
}

const excluirPokemon = async(id) => {
  const aux = await Pokemon.findByIdAndDelete({_id: id})
  return aux;
}

const excluirTreinador = async(id) => {
  const aux = await Treinador.findByIdAndDelete({_id: id})
  return aux;
}

const buscarTreinadorNome = async (nome) => {
  const aux = await Treinador.findOne({nome: nome})
  return aux;
}

const buscarTreinadorId = async (id) => {
  const aux = await Treinador.findById({_id: id})
  return aux;
}

const buscarPokemon = async (numero) => {
  const aux = await Pokemon.findOne({numero: numero})
  return aux;
}

const buscarHabilidadeNome = async (nome) => {
  const aux = await Habilidade.findOne({nome: nome})
  return aux;
}

const buscarHabilidadeId = async (id) => {
  const aux = await Treinador.findById({_id: id})
  return aux;
}

module.exports = {
    Treinador,
    Pokemon,
    Habilidade,
    salvarHabilidade,
    salvarPokemon,
    salvarTreinador,
    alterarHabilidade,
    alterarPokemon,
    alterarTreinador,
    excluirHabilidade,
    excluirPokemon,
    excluirTreinador,
    buscarHabilidadeId,
    buscarHabilidadeNome,
    buscarPokemon,
    buscarTreinadorId,
    buscarTreinadorNome,
}
