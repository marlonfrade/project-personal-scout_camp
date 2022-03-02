const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  //Inserting the fields the campground requires
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // Reviews Schema
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Removing All the camps before load it.
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

//Exporting The Module(params required to be accessed)
module.exports = mongoose.model("Campground", CampgroundSchema);
