// Required Stuff
const campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

// Index Page of Campgrounds
module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// New Form to add a campground
module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

// Create a new Campground
module.exports.createCampground = async (req, res, next) => {
  const camp = new campground(req.body.campground);
  // Map through the path and the filename of input type file, to get a new image
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.author = req.user._id;
  await camp.save();
  // Flash a success message to user
  req.flash("success", "Successfully Made a New Campground!");
  res.redirect(`/campgrounds/${camp.id}`);
  console.log(camp);
};

// View The Campground
module.exports.showCampground = async (req, res) => {
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
};

// View The Edit Form
module.exports.renderEditForm = async (req, res) => {
  // Destructuring the if from the URL params
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp) {
    req.flash("error", "Sorry, Campground Not Found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

// PUT route to update campground
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.images.push(...imgs);
  await camp.save();
  // Update the images if the user delete some images using the pull operator again
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  // Flash Message Success
  req.flash("success", "Successfully Updated Campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

// Delete the Campground
module.exports.deleteCampground = async (req, res) => {
  // Destructuring the id of the url params
  const { id } = req.params;
  // Find this One and Delete It
  await campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Campground!");
  res.redirect("/campgrounds");
};

// P.S.
// Don't need to exports every single Route, you can put all in an object and exports it
// I prefer to exports every single route like this way
