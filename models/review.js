// Construindo a avaliação do usuário para os acampamentos, podendo receber duas variáveis, sendo o body o comentário, o texto inserido
// dentro da avaliação do acampamento e o rating a classificação que o usuário deu para o acampamento
// Ideias: pode adicionar uma avaliação sendo o usuário submetido a um mini formulário para popular o banco de dados com as criticas mais definidas
// Para aquele acampamento avaliado.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
