// Iniciando a aplicação com express
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// npm install ejs-mate
const ejsMate = require("ejs-mate");
// Depois de instalar o package JOI npm i joi
// const Joi = require("joi");

// npm i express-session
const session = require("express-session");
// npm i connect-flash
const flash = require("connect-flash");

// Após validar a rota 404 e implementar a classe de erros, podemos utilizar essa para poder inserir.
const ExpressError = require("./utils/ExpressError");
// npm install method-override
const methodOverride = require("method-override");
// Utilizamos o pacote override para criar uma atualização no fake no módulo de edição, porém precisamos utilizar esse pacote:
const campgrounds = require("./routes/campground");
const reviews = require("./routes/reviews");

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Para dizer ao express para dar um parse(analisar) no body
app.use(express.urlencoded({ extended: true }));
// Precisamos utilizar o método override que declaramos acima
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "myfirstsecret",
  resave: false,
  saveUninitialized: true,
  // configurando o cookie
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Criaremos um middleware para configurar toda a parte de informação que o flash for enviar ao usuário
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// Acessa a página home
app.get("/", (req, res) => {
  res.render("home");
});

// Criando uma rota teste para validarmos uma rota 404, utilizando o app.all que recebe todas as requests feitas dentro da aplicação
app.all("*", (req, res, next) => {
  // res.send("404!!");
  // Ou poderiamos usar nossa error class para poder fazer isso de outra forma passando o erro para nossa classe auxiliar que criamos dentro da pasta utils
  next(new ExpressError("Page Not Found", 404));
});

// Criando um middleware para lidar com entrada de uma string na input de preço.
app.use((err, req, res, next) => {
  // Poderiamos passar um res.status(404), porem ele iria forçar nosso status a ser sempre 404, e nosso middleware ira lidar com outros tipos de responses e erros, então fazemos uma destructuring
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

// Criando um novo campground exemplo
// Não precisaremos criar um campground, o usuário fará isso, então deixarei comentado apenas para teste
// app.get("/makeCampground", async (req, res) => {
//   const camp = new campground({
//     title: "Marlon",
//     description: "marlon campground",
//   });
//   await camp.save();
//   res.send(camp);
// });

app.listen(3000, () => {
  console.log("serving on port 3000");
});
