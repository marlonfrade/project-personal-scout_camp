// Iniciando a aplicação com express
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// Conectando o módulo campground
const campground = require("./models/campground");

// Conexão com o Mongo
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Confirmando a conexão com o banco de dados, valores podem ser alterados.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

// Criando um novo campground exemplo
app.get("/makeCampground", async (req, res) => {
  const camp = new campground({ title: "Marlon" });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
