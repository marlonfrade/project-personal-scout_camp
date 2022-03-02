// Required Stuff
const express = require("express");
const router = express.Router({ mergeParams: true });
const campground = require("../models/campground");
const Review = require("../models/review");
// Middleware Required
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// POST route to create a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
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
  })
);

// Delete the Review
// Middleware to auth the user to delete if own the review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Mongo Feature called Pull
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
