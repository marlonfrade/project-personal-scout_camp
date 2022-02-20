// Iniciando a aplicação com express
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// npm install ejs-mate
const ejsMate = require("ejs-mate");
// Depois de instalar o package JOI npm i joi
// const Joi = require("joi");
// Requisitando os Schemas que criamos dentro do file schemas.js
const { campgroundSchema, reviewSchema } = require("./schemas.js");
//requisitando a pasta utils com os construtores de erros
const catchAsync = require("./utils/catchAsync");
// Após validar a rota 404 e implementar a classe de erros, podemos utilizar essa para poder inserir.
const ExpressError = require("./utils/ExpressError");
// npm install method-override
const methodOverride = require("method-override");
// Utilizamos o pacote override para criar uma atualização no fake no módulo de edição, porém precisamos utilizar esse pacote:
// Conectando o módulo campground
const campground = require("./models/campground");
const Review = require("./models/review");

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

// Criando um middleware para validar algumas rotas, como ele nao sera aplicado em todas as rotas criamos uma função para ser chamada dentro das rotas selecionadas.
const validateCampground = (req, res, next) => {
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

// Criando um segundo middleware conforme o middleware acima para validar a rota da avaliação do acampamento, utilizando o arquivo schemas.js com JOI
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  // Podemos dar um console.log no error para poder ver dentro do terminal se estamos de fato recebendo esse erro que estamos condicionando no if abaixo
  console.log(error);
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

// Acessa a página home
app.get("/", (req, res) => {
  res.render("home");
});

// Criaremos uma rota para acessar a visualização dos campgrounds, para aguardar precisaremos de uma função assíncrona
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await campground.find({});
    // Agora precisaremos de uma renderização de páginas para visualizar os acampamentos.E precisamos utilizar a variável campgrounds que declaramos
    res.render("campgrounds/index", { campgrounds });
    // No exemplo acima precisamos passar nossa variável declarada para que o sistema funcione corretamente.
  })
);

// Criar uma rota para criação de um novo acampamento(precisamos que essa rota seja executada antes do id, pois caso contrário a mesma irá tratar a rota como se fosse um id de um acampamento)
app.get("/campgrounds/new", (req, res) => {
  // Precisaremos de um formulário para realizar nosso método post
  res.render("campgrounds/new");
});

// Criar um método post para receber os valores inseridos dentro do formulário para criação de um novo acampamento
// app.post("/campgrounds", async (req, res) => {
// res.send(req.body);
// No exemplo acima teremos um retorno vazio pois o body não enviará nada por padrão, para isso precisamos de um parse
// Para isso declaramos acima: app.use(express.urlencoded({ extended: true }));
// Verificamos se foi enviado os valores preenchidos dentro do formulário e utilizamos eles abaixo para criação de um novo acampamento
// res.send(req.body.campground)
// O exemplo acima irá nos fornecer as informações presentes no array enviado com o body, agora precisamos aplicar eles dentro do um novo acampamento
// const camp = new campground(req.body.campground);
// await camp.save();
// res.redirect("/campgrounds");
// No exemplo acima levamos o usuário de volta a página inicial, porém podemos levar ele direto ao acampamento que ele criou
// res.redirect(`/campgrounds/${camp.id}`);
// });

// Mesmo codigo acima ja com a parte do middleware para lidar com o usuario inserindo uma string no campo de preço.
app.post(
  "/campgrounds",
  validateCampground,
  //Depois que criamos a nossa classe de erros, implementamos ela dentro de todas as funções assíncronas dentro do código
  catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    await camp.save();
    // No exemplo acima levamos o usuário de volta a página inicial, porém podemos levar ele direto ao acampamento que ele criou
    res.redirect(`/campgrounds/${camp.id}`);
  })
);

// Utilizaremos uma rota para acessar o campground e utilizar o ID dele para exibir maiores informações sobre o acampamento
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    // Definimos uma variável para apresentar o conteúdo do acampamento corretamente, após verificar que a página está sendo renderizada corretamente.
    // Depois que definimos nosso middleware para criar avaliações do acampamento, podemos utilizar ele para popular nosso acampamento utilizando o id
    // E criar novas avaliações a serem renderizadas para o usuário
    const camp = await campground.findById(req.params.id).populate("reviews");
    // Daremos um console no campground para ver dentro do banco de dados as avaliações criadas
    // Após inserir o console.log abaixo confirmar ao atualizar a página que recebemos as informações no terminal
    // Das avaliações criadas dentro do acampamento
    // console.log(camp);
    // Depois de verificar e obter o retorno esperado, podemos dentro do arquivo show.ejs criar um loop dentro dessas avaliações para poder
    // visualizar elas dentro de cada acampamento selecionado,
    // podendo adicionar funções posteriormente para o usuário que criou o perfil poder remover a avaliação que ele adicionou

    // Precisaremos utilizar o id para acessar, mas começamos renderizando a página de visualização do acampamento
    res.render("campgrounds/show", { camp });
    // Cria a página de renderização e verifica se está funcionando através de um fake id
    // Após isso criamos um link para cada acampamento para que possamos visualizar os detalhes ao clicar
    // Após definir a variável não esquecer de utilizar ela ao renderizar a página.
  })
);

// Criar uma rota para edição dos acampamentos
app.get(
  "/campground/:id/edit",
  catchAsync(async (req, res) => {
    // Precisaremos encontrar o id que está sendo clicado e então renderizar uma página com um formulário onde o usuário poderá editar o conteúdo do acampamento
    // Para isso basicamente copiamos o que fizemos na rota acima
    const camp = await campground.findById(req.params.id);
    res.render("campgrounds/edit", { camp });
  })
);

// Agora que instalamos e utilizamos no nosso código o pacote npm install method-override podemos criar uma rota put como abaixo
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    // res.send("IT WORKED");
    // O exemplo acima é para validar que nosso formulário de edição está funcionando corretamente, após validar isso partimos para a atualização do acampamento
    const { id } = req.params;
    // Podemos desestruturar a função conforme acima
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // Podemos dar um spread conforme acima pois estamos lidando com um objeto, damos um await para funcionar corretamente e depois aplicamos isso a uma variável
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Criando uma rota para o usuário poder deletar um acampamento
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    // Precisamos pegar o ID do request
    const { id } = req.params;
    // Podemos procurar esse ID e deletar ele ou se tivermos muitas informações sobre o acampamento primeiro teríamos que filtrar essas informações, tratar elas para somente depois podermos exclui-la, porém estamos aplicando o CRUD básico e por enquanto apenas o delete irá funcionar corretamente
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// Criando uma rota para o review, onde utilizaremos o id do campground para acessar o review e adicionar ao campground especifico a avaliação
app.post(
  "/campgrounds/:id/reviews",
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
    // redireciona o usuário para a tela do acampamento avaliado
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Criando uma rota para remover as avaliações dos acampamentos

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
