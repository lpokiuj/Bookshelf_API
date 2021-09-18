const express = require("express");
const app = express();
const nanoid = require("nanoid").nanoid;

app.use(express.json());

const books = [];

// PORT listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Listening on PORT " + port);
});

// Pushing new book
app.post("/books", (req, res) => {
    // Error
    const errorMSG = {};
    if (!req.body.name) {
        errorMSG.status = "fail";
        errorMSG.message = "Gagal menambahkan buku. Mohon isi nama buku";
        return res.status(400).json(errorMSG);
    }
    if (req.body.readPage > req.body.pageCount) {
        errorMSG.status = "fail";
        errorMSG.message = "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
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
});

// Get all book
app.get("/books", (req, res) => {
    const book = [];

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
            if(c.name.toLowerCase().indexOf(req.query.name.toLowerCase()) === -1){
                return c;
            }
        });

    }

    for (let i = 0; i < filter.length; i++) {
        const bookObject = {
            id: filter[i].id,
            name: filter[i].name,
            publisher: filter[i].publisher,
        };
        book.push(bookObject);
    }

    const sendMSG = {
        status: "success",
        data: {
            books: book,
        },
    };

    return res.status(200).send(sendMSG);
});

// Get books by ID
app.get("/books/:id", (req, res) => {
    // console.log(req.params.id);

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
});

// Update book data
app.put("/books/:id", (req, res) => {
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
        errorMSG.message = "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
        return res.status(400).json(errorMSG);
    }

    // Success
    for (let i = 0; i < books.length; i++) {
        if (req.params.id === books[i].id) {
            books[i].name = req.body.name;
            books[i].year = req.body.year;
            books[i].author = req.body.author;
            books[i].summary = req.body.summary;
            books[i].publisher = req.body.publisher;
            books[i].pageCount = req.body.pageCount;
            books[i].readPage = req.body.readPage;
            books[i].reading = req.body.reading;
            books[i].updatedAt = new Date().toISOString();
        }
    }
    return res.status(200).json({
        status: "success",
        message: "Buku berhasil diperbarui",
    });
});

// Delete book
app.delete("/books/:id", (req, res) => {
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
});
