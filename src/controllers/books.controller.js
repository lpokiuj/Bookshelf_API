const { Router } = require("express");
const bookService = require("../services/books.services");

const router = Router();
router.post("/", bookService.createBook);
router.get("/", bookService.getAll);
router.get("/:id", bookService.getBookById);
router.put("/:id", bookService.updateBook);
router.delete("/:id", bookService.deleteBook);

module.exports = router;
