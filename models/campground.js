const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

// Separate the imageSchema to use de virtual feature of mongo
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// Using the virtual, requires a get with a callback func
ImageSchema.virtual("thumbnail").get(function () {
  // Then we use replace to /uploads
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  //Inserting the fields the campground requires
  title: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  images: [ImageSchema],
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
