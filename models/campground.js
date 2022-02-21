const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  //Definindo os campos de inserção de dados:
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  // Após a construção do arquivo review.js, utilizaremos ele dentro do nosso schema na relação one-to-more
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Criaremos uma função teste para validar que ao usuário remover um acampamento possamos também remover as avaliações inseridas naquele acampamento em específico
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // Daremos um console.log para verificar se ao clicarmos em remover um acampamento,
  // Temos como retorno dentro do terminal o nosso console, afirmando que esta tudo certo e podemos seguir com a lógica para remover de fato
  // console.log("DELETE");

  // depois de verificar, adicionamos na função assíncrona uma variável doc, e podemos dar um console nele para ver exatamente o que foi removido,
  // Então podemos utilizar da lógica de capturar o id do acampamento e remover a partir dele as avaliações criadas.
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
  // depois de adicionar a lógica, para testar, vamos ate um acampamento e adicionamos algumas avaliações,
  // Depois antes de remover vamos ate o mongo e filtramos por db.reviews.find(), e verificamos se os reviews foram adicionados,
  // Depois removemos os acampamentos, filtramos no banco mongo novamente, e o que esperamos é que todos os reviews tenham sido removidos.
});

//Exportando o módulo para um modelo:
module.exports = mongoose.model("Campground", CampgroundSchema);
