// Required Stuff
const express = require("express");
const router = express.Router({ mergeParams: true });
const campground = require("../models/campground");
const Review = require("../models/review");
// Middleware Required
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
// Controllers
const reviews = require("../controllers/reviews");

// POST route to create a review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete the Review
// Middleware to auth the user to delete if own the review(isReviewAuthor)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
