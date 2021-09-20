const express = require("express");
const app = express();
const booksController = require("./controllers/books.controller");
const todosController = require("./controllers/todos.controller");

app.use(express.json()); // buat parsing JSON

// Books endpoint
app.use("/books", booksController); // register book controller ke ENDPOINT '/books'

// Todo endpoint
app.use('/todos', todosController);

// PORT listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on PORT " + port);
});
