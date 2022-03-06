// Required Stuff
const User = require("../models/user");

// View The Register Form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// POST the register Form
module.exports.register = async (req, res, next) => {
  try {
    //   Destructuring the information we need
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to ScoutCamp ${username}`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// View the Login Page
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// POST route to Login
module.exports.login = (req, res) => {
  // Destructuring the information
  const { email, username, password } = req.body;
  req.flash("success", `Welcome Back, Scout ${username}`);
  //   Redirect user to page that he was or to main page
  const redirectUrl = req.session.returnTo || "/campgrounds";
  //   Then delete it to save a new one
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// Logout the User
module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", `Goodbye! See You Soon!`);
  res.redirect("/campgrounds");
};

// P.S.
// Don't need to exports every single Route, you can put all in an object and exports it
// I prefer to exports every single route like this way
