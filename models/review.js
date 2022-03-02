// Module to build the Review Schema
// Stuff to be required
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Declaring to mongoose
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
