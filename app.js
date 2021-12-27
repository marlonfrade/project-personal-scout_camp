// Iniciando a aplicação com express
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// npm install method-override
const methodOverride = require("method-override");
// Utilizamos o pacote override para criar uma atualização no fake no módulo de edição, porém precisamos utilizar esse pacote:
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

// Para dizer ao express para dar um parse(analisar) no body
app.use(express.urlencoded({ extended: true }));
// Precisamos utilizar o método override que declaramos acima
app.use(methodOverride("_method"));

// Acessa a página home
app.get("/", (req, res) => {
  res.render("home");
});

// Criaremos uma rota para acessar a visualização dos campgrounds, para aguardar precisaremos de uma função assíncrona
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await campground.find({});
  // Agora precisaremos de uma renderização de páginas para visualizar os acampamentos.E precisamos utilizar a variável campgrounds que declaramos
  res.render("campgrounds/index", { campgrounds });
  // No exemplo acima precisamos passar nossa variável declarada para que o sistema funcione corretamente.
});

// Criar uma rota para criação de um novo acampamento(precisamos que essa rota seja executada antes do id, pois caso contrário a mesma irá tratar a rota como se fosse um id de um acampamento)
app.get("/campgrounds/new", (req, res) => {
  // Precisaremos de um formulário para realizar nosso método post
  res.render("campgrounds/new");
});

// Criar um método post para receber os valores inseridos dentro do formulário para criação de um novo acampamento
app.post("/campgrounds", async (req, res) => {
  // res.send(req.body);
  // No exemplo acima teremos um retorno vazio pois o body não enviará nada por padrão, para isso precisamos de um parse
  // Para isso declaramos acima: app.use(express.urlencoded({ extended: true }));
  // Verificamos se foi enviado os valores preenchidos dentro do formulário e utilizamos eles abaixo para criação de um novo acampamento
  // res.send(req.body.campground)
  // O exemplo acima irá nos fornecer as informações presentes no array enviado com o body, agora precisamos aplicar eles dentro do um novo acampamento
  const camp = new campground(req.body.campground);
  await camp.save();
  // res.redirect("/campgrounds");
  // No exemplo acima levamos o usuário de volta a página inicial, porém podemos levar ele direto ao acampamento que ele criou
  res.redirect(`/campgrounds/${camp.id}`);
});

// Utilizaremos uma rota para acessar o campground e utilizar o ID dele para exibir maiores informações sobre o acampamento
app.get("/campgrounds/:id", async (req, res) => {
  // Definimos uma variável para apresentar o conteúdo do acampamento corretamente, após verificar que a página está sendo renderizada corretamente.
  const camp = await campground.findById(req.params.id);
  // Precisaremos utilizar o id para acessar, mas começamos renderizando a página de visualização do acampamento
  res.render("campgrounds/show", { camp });
  // Cria a página de renderização e verifica se está funcionando através de um fake id
  // Após isso criamos um link para cada acampamento para que possamos visualizar os detalhes ao clicar
  // Após definir a variável não esquecer de utilizar ela ao renderizar a página.
});

// Criar uma rota para edição dos acampamentos
app.get("/campground/:id/edit", async (req, res) => {
  // Precisaremos encontrar o id que está sendo clicado e então renderizar uma página com um formulário onde o usuário poderá editar o conteúdo do acampamento
  // Para isso basicamente copiamos o que fizemos na rota acima
  const camp = await campground.findById(req.params.id);
  res.render("campgrounds/edit", { camp });
});

// Agora que instalamos e utilizamos no nosso código o pacote npm install method-override podemos criar uma rota put como abaixo
app.put("/campgrounds/:id", async (req, res) => {
  // res.send("IT WORKED");
  // O exemplo acima é para validar que nosso formulário de edição está funcionando corretamente, após validar isso partimos para a atualização do acampamento
  const { id } = req.params;
  // Podemos desestruturar a função conforme acima
  const camp = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  // Podemos dar um spread conforme acima pois estamos lidando com um objeto, damos um await para funcionar corretamente e depois aplicamos isso a uma variável
  res.redirect(`/campgrounds/${camp._id}`);
});

// Criando uma rota para o usuário poder deletar um acampamento
app.delete("/campgrounds/:id", async (req, res) => {
  // Precisamos pegar o ID do request
  const { id } = req.params;
  // Podemos procurar esse ID e deletar ele ou se tivermos muitas informações sobre o acampamento primeiro teríamos que filtrar essas informações, tratar elas para somente depois podermos exclui-la, porém estamos aplicando o CRUD básico e por enquanto apenas o delete irá funcionar corretamente
  await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// Criando um novo campground exemplo
// // Não precisaremos criar um campground, o usuário fará isso, então deixarei comentado apenas para teste
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
