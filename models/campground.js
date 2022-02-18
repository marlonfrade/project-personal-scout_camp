const mongoose = require("mongoose");
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

//Exportando o módulo para um modelo:
module.exports = mongoose.model("Campground", CampgroundSchema);
