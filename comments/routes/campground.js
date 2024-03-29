const express = require("express");
const router = express.Router();

//requisitando a pasta utils com os construtores de erros
const catchAsync = require("../utils/catchAsync");
// Conectando o módulo campground
const campground = require("../models/campground");

// Requisitando o middleware para validar se o usuário fez o login
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// Criaremos uma rota para acessar a visualização dos campgrounds, para aguardar precisaremos de uma função assíncrona
router.get("/", catchAsync());

// Criar uma rota para criação de um novo acampamento(precisamos que essa rota seja executada antes do id, pois caso contrário a mesma irá tratar a rota como se fosse um id de um acampamento)
router.get("/new", isLoggedIn, (req, res) => {
  // Precisaremos de um formulário para realizar nosso método post
  res.render("campgrounds/new");
});

// Criar um método post para receber os valores inseridos dentro do formulário para criação de um novo acampamento
// router.post("/", async (req, res) => {
// res.send(req.body);
// No exemplo acima teremos um retorno vazio pois o body não enviará nada por padrão, para isso precisamos de um parse
// Para isso declaramos acima: router.use(express.urlencoded({ extended: true }));
// Verificamos se foi enviado os valores preenchidos dentro do formulário e utilizamos eles abaixo para criação de um novo acampamento
// res.send(req.body.campground)
// O exemplo acima irá nos fornecer as informações presentes no array enviado com o body, agora precisamos aplicar eles dentro do um novo acampamento
// const camp = new campground(req.body.campground);
// await camp.save();
// res.redirect("/");
// No exemplo acima levamos o usuário de volta a página inicial, porém podemos levar ele direto ao acampamento que ele criou
// res.redirect(`//${camp.id}`);
// });

// Mesmo codigo acima ja com a parte do middleware para lidar com o usuario inserindo uma string no campo de preço.
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  //Depois que criamos a nossa classe de erros, implementamos ela dentro de todas as funções assíncronas dentro do código
  catchAsync(async (req, res, next) => {
    const camp = new campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully Made a New Campground!");
    // No exemplo acima levamos o usuário de volta a página inicial, porém podemos levar ele direto ao acampamento que ele criou
    res.redirect(`/campgrounds/${camp.id}`);
  })
);

// Utilizaremos uma rota para acessar o campground e utilizar o ID dele para exibir maiores informações sobre o acampamento
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    // Definimos uma variável para apresentar o conteúdo do acampamento corretamente, após verificar que a página está sendo renderizada corretamente.
    // Depois que definimos nosso middleware para criar avaliações do acampamento, podemos utilizar ele para popular nosso acampamento utilizando o id
    // E criar novas avaliações a serem renderizadas para o usuário
    const camp = await campground
      .findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    // Daremos um console no campground para ver dentro do banco de dados as avaliações criadas
    // Após inserir o console.log abaixo confirmar ao atualizar a página que recebemos as informações no terminal
    // Das avaliações criadas dentro do acampamento
    // console.log(camp);
    // Depois de verificar e obter o retorno esperado, podemos dentro do arquivo show.ejs criar um loop dentro dessas avaliações para poder
    // visualizar elas dentro de cada acampamento selecionado,
    // podendo adicionar funções posteriormente para o usuário que criou o perfil poder remover a avaliação que ele adicionou

    if (!camp) {
      req.flash("error", "Sorry, Campground Not Found!");
      return res.redirect("/campgrounds");
    }

    // Precisaremos utilizar o id para acessar, mas começamos renderizando a página de visualização do acampamento
    res.render("campgrounds/show", { camp });
    // Cria a página de renderização e verifica se está funcionando através de um fake id
    // Após isso criamos um link para cada acampamento para que possamos visualizar os detalhes ao clicar
    // Após definir a variável não esquecer de utilizar ela ao renderizar a página.
  })
);

// Criar uma rota para edição dos acampamentos
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // Precisaremos encontrar o id que está sendo clicado e então renderizar uma página com um formulário onde o usuário poderá editar o conteúdo do acampamento
    // Para isso basicamente copiamos o que fizemos na rota acima
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp) {
      req.flash("error", "Sorry, Campground Not Found!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);

// Agora que instalamos e utilizamos no nosso código o pacote npm install method-override podemos criar uma rota put como abaixo
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    // res.send("IT WORKED");
    // O exemplo acima é para validar que nosso formulário de edição está funcionando corretamente, após validar isso partimos para a atualização do acampamento
    const { id } = req.params;

    // Podemos desestruturar a função conforme acima
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully Updated Campground!");
    // Podemos dar um spread conforme acima pois estamos lidando com um objeto, damos um await para funcionar corretamente e depois aplicamos isso a uma variável
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

// Criando uma rota para o usuário poder deletar um acampamento
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    // Precisamos pegar o ID do request
    const { id } = req.params;
    // Podemos procurar esse ID e deletar ele ou se tivermos muitas informações sobre o acampamento primeiro teríamos que filtrar essas informações, tratar elas para somente depois podermos exclui-la, porém estamos aplicando o CRUD básico e por enquanto apenas o delete irá funcionar corretamente
    await campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
