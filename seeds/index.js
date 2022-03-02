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
      author: "621cc2ce5c3803e5b5824858",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)} `,
      // Lorem Ipsum to description
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat explicabo numquam voluptates unde dolorem nisi ipsam,",
      price,
      // Using the file input to get the path url and add
      images: [
        {
          url: "https://res.cloudinary.com/marlonmelo/image/upload/v1646247986/YelpCamp/siubdsmkz0efoybjtlyg.jpg",
          filename: "YelpCamp/siubdsmkz0efoybjtlyg",
        },
        {
          url: "https://res.cloudinary.com/marlonmelo/image/upload/v1646247988/YelpCamp/ee2bo6adsjxna8wzo5to.jpg",
          filename: "YelpCamp/ee2bo6adsjxna8wzo5to",
        },
        {
          url: "https://res.cloudinary.com/marlonmelo/image/upload/v1646247989/YelpCamp/ofb4ksaluuiblj3zmtrp.jpg",
          filename: "YelpCamp/ofb4ksaluuiblj3zmtrp",
        },
      ],
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
