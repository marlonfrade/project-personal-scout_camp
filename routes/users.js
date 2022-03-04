// Required Stuff
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

// Middleware Require from middleware.js
const { isLoggedIn } = require("../middleware");

// npm i passport
const passport = require("passport");
// Controllers
const users = require("../controllers/users");

// Register Form Page Route
router.get("/register", users.renderRegister);

// Register POST user
router.post("/register", isLoggedIn, catchAsync(users.register));

// Login Form Page
router.get("/login", users.renderLogin);

// POST route to Login the User
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

// LogOut the User
router.get("/logout", users.logout);

module.exports = router;
