// Required Stuff
const express = require("express");
const router = express.Router();
// Controllers
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");

// Middleware Require from middleware.js
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// npm i multer-storage-cloudinary
const { storage } = require("../cloudinary");
// npm i multer
const multer = require("multer");
const upload = multer({ storage });

// Router = App
// Campgrounds List Page
router.get("/", catchAsync(campgrounds.index));
router.get("/map", catchAsync(campgrounds.noMap));

// Creating a Campground
router.get("/new", isLoggedIn, campgrounds.newForm);

// POST route to create a camp
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// View Campground Route
router.get("/:id", catchAsync(campgrounds.showCampground));

// Edit Campgrounds
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//  npm install method-override
// PUT route to edit the campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

// Delete a Campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
