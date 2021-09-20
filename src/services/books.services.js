const { nanoid } = require("nanoid"); // Object destructuring
let books = require("../models/books.model");

const services = {
  createBook: (req, res) => {
    // Error
    const errorMSG = {};
    if (!req.body.name) {
      errorMSG.status = "fail";
      errorMSG.message = "Gagal menambahkan buku. Mohon isi nama buku";
      return res.status(400).json(errorMSG);
    }
    if (req.body.readPage > req.body.pageCount) {
      errorMSG.status = "fail";
      errorMSG.message =
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
      return res.status(400).json(errorMSG);
    }

    const book = {
      id: nanoid(),
      name: req.body.name,
      year: req.body.year,
      author: req.body.author,
      summary: req.body.summary,
      publisher: req.body.publisher,
      pageCount: req.body.pageCount,
      readPage: req.body.readPage,
      finished: req.body.readPage < req.body.pageCount ? false : true,
      reading: req.body.reading,
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const lengthObject = books.length;
    books.push(book);

    if (lengthObject >= books.length) {
      errorMSG.status = "error";
      errorMSG.message = "Buku gagal ditambahkan";
      return res.status(500).json(errorMSG);
    }

    const sendData = {
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: book.id,
      },
    };

    return res.status(201).send(sendData);
  },
  getAll: (req, res) => {
    // const book = [];

    let filter = books;

    // filter by reading
    if (req.query.reading) {
      filter = filter.filter((c) => {
        return c.reading == req.query.reading;
      });
    }

    // filter by finished
    if (req.query.finished) {
      filter = filter.filter((c) => {
        return c.finished == req.query.finished;
      });
    }

    // filter by name
    if (req.query.name) {
      filter = filter.filter((c) => {
        if (c.name.toLowerCase().indexOf(req.query.name.toLowerCase()) === -1) {
          return c;
        }
      });
    }

    const filteredBook = filter.map(({ id, name, publisher }) => ({ id, name, publisher }));

    const sendMSG = {
      status: "success",
      data: {
        books: filteredBook,
      },
    };

    return res.status(200).send(sendMSG);
  },
  // Get books based on id
  getBookById: (req, res) => {
    const book = books.find((c) => {
      return c.id === req.params.id;
    });

    if (book) {
      return res.status(200).json({
        status: "success",
        data: { book: book },
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Buku tidak ditemukan",
      });
    }
  },
  // Update book data
  updateBook: (req, res) => {
    // Error not found (404)
    const book = books.find((c) => {
      return c.id === req.params.id;
    });

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      });
    }

    // Error fail (400)
    const errorMSG = {};
    if (!req.body.name) {
      errorMSG.status = "fail";
      errorMSG.message = "Gagal memperbarui buku. Mohon isi nama buku";
      return res.status(400).json(errorMSG);
    }
    if (req.body.readPage > req.body.pageCount) {
      errorMSG.status = "fail";
      errorMSG.message =
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
      return res.status(400).json(errorMSG);
    }

    // Update original object
    books = books.map((book) => {
      if (req.params.id === book.id) {
        book = Object.assign(book, req.body);
        book.updatedAt = new Date().toISOString();
        return book;
      }

      return book;
    });

    return res.status(200).json({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
  },

  deleteBook: (req, res) => {
    const book = books.find((c) => {
      return c.id === req.params.id;
    });

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
    }

    const index = books.indexOf(book);
    books.splice(index, 1);

    return res.status(200).json({
      status: "success",
      message: "Buku berhasil dihapus",
    });
  },
};

module.exports = services;
