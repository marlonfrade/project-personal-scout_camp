module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
