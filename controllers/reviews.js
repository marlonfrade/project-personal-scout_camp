// Required Stuff
const campground = require("../models/campground");
const Review = require("../models/review");

// Create a Review
module.exports.createReview = async (req, res) => {
  const camp = await campground.findById(req.params.id);
  // Creating by the Review Schema
  const review = new Review(req.body.review);
  review.author = req.user._id;
  // Access the review field on a camp and push it
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  // Flash the success message
  req.flash("success", "Created a New Review!");
  res.redirect(`/campgrounds/${camp._id}`);
};

// Delete The Review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // Mongo Feature called Pull
  await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/campgrounds/${id}`);
};

// P.S.
// Don't need to exports every single Route, you can put all in an object and exports it
// I prefer to exports every single route like this way
