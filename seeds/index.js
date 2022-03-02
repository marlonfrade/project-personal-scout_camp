// Required Stuff
const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
// Destructuring the information we need from the seedHelpers
const { places, descriptors } = require("./seedHelpers");

// Mongo Connections
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Confirm the connection in the console
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// Get a random array to fill the campgrounds fields
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed the fields
const seedDB = async () => {
  await campground.deleteMany({});
  // Await the camps to be deleted
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      author: "621f2b982480dcaf99cea32a",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)} `,
      // UnSplash API to get the images DB from a collection and fill the campgrounds images
      image: "https://source.unsplash.com/collection/483251",
      // Lorem Ipsum to description
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat explicabo numquam voluptates unde dolorem nisi ipsam, error repellendus fugit tenetur ipsum necessitatibus illum omnis totam, placeat, quasi vero facere a!",
      price,
    });
    await camp.save();
    // Await to save it, now we have 50 camps to be added in our database
  }
};

// Execute it
// seedDB();

// Return a promise, then use this function below
seedDB().then(() => {
  mongoose.connection.close();
});
