// Required Stuff
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");

// Middleware Require from middleware.js
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Router = App
// Campgrounds List Page
router.get("/", catchAsync());

// Creating a Campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// POST route to create a camp
router.post(
  "/",
  isLoggedIn,
  validateCampground,

  catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    // Flash a success message to user
    req.flash("success", "Successfully Made a New Campground!");
    res.redirect(`/campgrounds/${camp.id}`);
  })
);

// View Campground Route
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await campground
      .findById(req.params.id)
      // Use path to populate something inside a populate.
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!camp) {
      req.flash("error", "Sorry, Campground Not Found!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { camp });
  })
);

// Edit Campgrounds
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // Precisaremos encontrar o id que está sendo clicado e então renderizar uma página com um formulário onde o usuário poderá editar o conteúdo do acampamento
    // Para isso basicamente copiamos o que fizemos na rota acima
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp) {
      req.flash("error", "Sorry, Campground Not Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);

//  npm install method-override
// PUT route to edit the campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // Flash Message Success
    req.flash("success", "Successfully Updated Campground!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Delete a Campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    // Destructuring the id of the url params
    const { id } = req.params;
    // Find this One and Delete It
    await campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
