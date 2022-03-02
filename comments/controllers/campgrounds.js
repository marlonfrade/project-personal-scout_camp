module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  // Agora precisaremos de uma renderização de páginas para visualizar os acampamentos.E precisamos utilizar a variável campgrounds que declaramos
  res.render("campgrounds/index", { campgrounds });
  // No exemplo acima precisamos passar nossa variável declarada para que o sistema funcione corretamente.
};
