// npm i dotenv
// env config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_KEY);
console.log(process.env.CLOUDINARY_SECRET);

// Required Stuff
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// npm install ejs-mate
const ejsMate = require("ejs-mate");
// npm i joi
// const Joi = require("joi");
// npm i express-session
const session = require("express-session");
// npm i connect-flash
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
// npm install method-override
const methodOverride = require("method-override");
// npm i passport passport-local passport-local-mongoose
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
// npm i express-mongo-sanitize
const mongoSanitize = require("express-mongo-sanitize");

// Mongo Connection with the DB name
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection success printed in the terminal
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// Execute the express app
const app = express();
// Port of the App
const port = 3000;

// Set the views engine to be rendered
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse the body to get information
app.use(express.urlencoded({ extended: true }));
// use the override method
app.use(methodOverride("_method"));
// Render the static files from public directory
app.use(express.static(path.join(__dirname, "public")));
// Using Mongo Sanitize to prevent the basics security issues
app.use(mongoSanitize());

// Cookies Config
const sessionConfig = {
  secret: "myfirstsecret",
  resave: false,
  saveUninitialized: true,
  // configurando o cookie
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Initialize the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Config
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Use the Routes on this main file(routers folder)
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// 404 Route in case of access a page that doesn't exists
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Middleware to handle if user inserts a string value on the price field form
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

// Listen the Application
app.listen(port, () => {
  console.log(`Application Listening on port: ${port}`);
});
