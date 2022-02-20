const Joi = require("joi");

// Comentado abaixo para podermos implementar o schema utilizando o pacote instalado JOI
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

// Criando o modulo para exportar a validação que criamos para o schema de avaliação do acampamento
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
  // Todo o modelo do review precisa ser requerido conforme acima
  // Verificando a documentação do JOI podemos adicionar uma validação para um numero mínimo e máximo
  // Como estamos usando um Range Input com valor entre 1 e 5, podemos utilizar esses valores conforme a documentação do JOI
});
