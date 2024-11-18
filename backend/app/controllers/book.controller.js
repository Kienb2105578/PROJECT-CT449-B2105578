// book.controller.js

const ApiError = require("../api-error");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.getAllBooks = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const documents = await bookService.getAllBooks(req.query);
    return res.status(200).json(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving books"));
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.getBookById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.deleteBook(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.updateBook(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not updated book with id=${req.params.id}`)
    );
  }
};

exports.addBook = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.addBook(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query; // Lấy giá trị từ query string
    if (!q) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
    }

    // Tiến hành tìm kiếm sách theo từ khóa 'q'
    const books = await books.find({ name: { $regex: q, $options: "i" } }); // Tìm kiếm sách có tên chứa từ khóa 'q'

    if (books.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách nào." });
    }

    res.json({ books }); // Trả về danh sách sách
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm sách." });
  }
};
exports.updateBookQuantity = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body; // Lấy ID sách và số lượng từ body request

    // Kiểm tra sự tồn tại của bookId và quantity
    if (!bookId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp ID sách và số lượng" });
    }

    const bookService = new BookService(MongoDB.client);
    const updatedBook = await bookService.updateBookQuantity(bookId, quantity);

    return res.status(200).json({
      message: "Số lượng sách đã được cập nhật thành công",
      book: updatedBook,
    });
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi khi cập nhật số lượng sách")
    );
  }
};
