// Required Stuff
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
// Models
const campground = require("./models/campground");
const Review = require("./models/review");

// Middleware to Validate if user is Logged
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Using returnTo to send user back if he tries to access something that requires login first
    req.session.returnTo = req.originalUrl;
    // Flash that the route requires login first
    req.flash("error", "You must be Signed in!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to validate the forms when need
module.exports.validateCampground = (req, res, next) => {
  // Destructuring the error from array
  const { error } = campgroundSchema.validate(req.body);
  // Conditionals
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware to validate if the User Owns the campground to edit and delete it.
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camps = await campground.findById(id);
  if (!camps.author.equals(req.user._id)) {
    req.flash("error", "You need Permission to do That!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware to validate if the user owns the review to remove it
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You need Permission to do That!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware to validate the review fields of the form
module.exports.validateReview = (req, res, next) => {
  // Destructuring the error from array
  const { error } = reviewSchema.validate(req.body);
  // Conditionals
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
