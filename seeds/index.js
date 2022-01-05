const mongoose = require("mongoose");
// Conectando o módulo campground
const campground = require("../models/campground");
// Conectando ao módulo cities
const cities = require("./cities");
// Desestruturando o seedHelpers
const { places, descriptors } = require("./seedHelpers");

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

// Função para pegar um número aleatório dentro de um array para que possamos criar um nome para nosso acampamento
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Iniciaremos apagando tudo que está dentro do banco de dados
const seedDB = async () => {
  await campground.deleteMany({});
  // Depois de apagar criamos um novo campground teste
  //   const cTest = new campground({ title: "test" });
  //   await cTest.save();
  // Faremos um for para poder criar 50 novos campgrounds utilizando como banco de dados as 1000 cidades cadastradas, por isso pegaremos um número aleatório até 1000
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      //   Utilizamos o banco de dados e a extração de um número aleatório do array para extrair um valor de cada um deles e criar nosso título para o acampamento.
      title: `${sample(descriptors)} ${sample(places)} `,
      // Utilizamos a API do unplash para poder renderizar imagens aleatórias
      image: "https://source.unsplash.com/collection/483251",
      // Criamos uma descrição para os acampamentos utilizando lorem ipsum
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat explicabo numquam voluptates unde dolorem nisi ipsam, error repellendus fugit tenetur ipsum necessitatibus illum omnis totam, placeat, quasi vero facere a!",
      // Adicionamos um price com base na variável que definimos acima para renderizar um número aleatório
      price,
    });
    await camp.save();
    // Com isso devemos ter 50 novos acampamentos com localização extraída do nosso banco de dados das 1000 cidades
  }
};

// Precisamos executar a função para que ela retorne dentro do banco de dados
// seedDB();

// Como temos uma função assíncrona, nosso seedDB retorna um promise, então temos que atualizar a chamada de função para:
seedDB().then(() => {
  mongoose.connection.close();
});
