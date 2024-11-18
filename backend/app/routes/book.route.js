// book.route.js

const express = require("express");
const {
  getAllBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  updateBookQuantity, // Import hàm searchBooks
} = require("../controllers/book.controller");

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/create", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.put("/:id", updateBookQuantity);

// Thêm route cho tìm kiếm
router.get("/search", searchBooks);

module.exports = router;
