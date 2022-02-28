module.exports.isLoggedIn = (req, res, next) => {
  // Testando a URL que o usuário tentou conectar
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be Signed in!");
    res.redirect("/login");
  }
  next();
};
