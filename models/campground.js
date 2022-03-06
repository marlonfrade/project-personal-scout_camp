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

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
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
  },
  opts
);

// Using the virtual again for popup maps, requires a get with a callback func
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  // Then we use replace to /uploads
  return `<a href="/campgrounds/${this.id}">${this.title}</a>
    <p>${this.description.substring(0, 50)}...</p>
  `;
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
