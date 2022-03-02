// Requisitando os Schemas que criamos dentro do file schemas.js
const { campgroundSchema, reviewSchema } = require("./schemas.js");
// Após validar a rota 404 e implementar a classe de erros, podemos utilizar essa para poder inserir.
const ExpressError = require("./utils/ExpressError");
// Conectando o módulo campground
const campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // Testando a URL que o usuário tentou conectar
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be Signed in!");
    return res.redirect("/login");
  }
  next();
};

// Criando um middleware para validar algumas rotas, como ele nao sera aplicado em todas as rotas criamos uma função para ser chamada dentro das rotas selecionadas.
module.exports.validateCampground = (req, res, next) => {
  // O result retorna um array, entao precisamos desestruturar ele.
  const { error } = campgroundSchema.validate(req.body);
  // Criando conditionals para atender os tipos de erros.
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  // Após validar os testes implementamos um middleware para realizar essa função que definimos apenas para a rota acima.
  // console.log(result);
  // Com o console.log podemos ver o resultado aplicando testes direto no postman, e assim verificando os validadores por parte do JOI que definimos dentro do schema.
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground Data", 400);
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camps = await campground.findById(id);
  if (!camps.author.equals(req.user._id)) {
    req.flash("error", "You need Permission to do That!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You need Permission to do That!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Criando um segundo middleware conforme o middleware acima para validar a rota da avaliação do acampamento, utilizando o arquivo schemas.js com JOI
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  // Podemos dar um console.log no error para poder ver dentro do terminal se estamos de fato recebendo esse erro que estamos condicionando no if abaixo
  // console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  // Não esqueça de verificar se no schemas.js temos o modulo do reviewSchema como required, pois precisamos dele para testar no postman,
  // Ao passar uma HTTP request como POST para a url /camp../id../reviews esperamos o resultado "review is required" para o body sem nenhuma informação
  // Depois inserindo o review[rating] e review[body] no body da request, esperamos que não tenha erro a ser apresentado
};
