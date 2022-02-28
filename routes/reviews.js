const express = require("express");
// we need to merge a param to get the id information in the req.params
const router = express.Router({ mergeParams: true });
// Conectando o módulo campground
const campground = require("../models/campground");
const Review = require("../models/review");

// Requisitando os Schemas que criamos dentro do file schemas.js
const { reviewSchema } = require("../schemas.js");

// Após validar a rota 404 e implementar a classe de erros, podemos utilizar essa para poder inserir.
const ExpressError = require("../utils/ExpressError");
//requisitando a pasta utils com os construtores de erros
const catchAsync = require("../utils/catchAsync");

// Criando um segundo middleware conforme o middleware acima para validar a rota da avaliação do acampamento, utilizando o arquivo schemas.js com JOI
const validateReview = (req, res, next) => {
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

// Criando uma rota para o review, onde utilizaremos o id do campground para acessar o review e adicionar ao campground especifico a avaliação
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // Verifica se está funcionando
    // res.send("You Made It!");
    const camp = await campground.findById(req.params.id);
    // Antes de criar um review function para implementar a avaliação do acampamento, precisa fazer o requerimento do review schema criado dentro da folder models
    // criando um novo schema no review utilizando o conteúdo inserido no body do acampamento
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created a New Review!");
    // redireciona o usuário para a tela do acampamento avaliado
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Criando uma rota para remover as avaliações dos acampamentos
// Utilizaremos o id do acampamento, seguido da rota da avaliação e o id da avaliação que deseja remover para poder acessar cada avaliação independentemente
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // Teste para validar a rota
    // res.send("DELETE");

    // Primeiro passo é desestruturar o id do acampamento com o id do review desse acampamento
    const { id, reviewId } = req.params;
    // Utilizamos o comando abaixo para poder selecionar o acampamento selecionado e filtrar dentro do array onde está o review selecionado
    // Para isso utilizaremos uma feature do mongo chamado pull
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Utilizamos o comando abaixo para remover o review com base no id do parâmetro
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/campgrounds/${id}`);
    // Após verificar se está removendo corretamente, precisaremos implantar que ao usuário remover um acampamento, toda a informação sobre avaliações seja removida também do banco de dados
  })
);

module.exports = router;
