const ApiError = require("../api-error");
const BorrowBookService = require("../services/borrowBook.service");
const MongoDB = require("../utils/mongodb.util");

exports.getAll = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);
    const { user_id } = req.query;
    const documents = await borrowBookService.getAll({ user_id });
    return res.status(200).json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};
exports.getById = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);

    const document = await borrowBookService.getById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);
    const document = await borrowBookService.delete(req.params.id);
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

exports.update = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);
    const document = await borrowBookService.update(req.params.id, req.body);
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
exports.add = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);
    const document = await borrowBookService.add(req.body);

    if (document === "Book already borrowed by this user") {
      return next(new ApiError(400, "Book already borrowed by this user"));
    }

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error ocurred while creating the contact")
    );
  }
};

exports.searchBooks = async (req, res, next) => {
  try {
    const borrowBookService = new BorrowBookService(MongoDB.client);

    // Lấy giá trị query từ query params (ví dụ: ?query=bookTitle)
    const { query } = req.query;

    if (!query) {
      return next(new ApiError(400, "Query parameter is required"));
    }

    // Tìm kiếm sách
    const books = await borrowBookService.searchBooks(query);

    // Kiểm tra nếu không có sách nào tìm thấy
    if (books.length === 0) {
      return next(new ApiError(404, "No books found matching the query"));
    }

    // Trả về kết quả tìm kiếm
    return res.status(200).json(books);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while searching for books")
    );
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Trạng thái không được để trống." });
    }

    const updatedBorrowBook = await borrowBookService.updateStatus(id, status);

    if (!updatedBorrowBook) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin mượn sách để cập nhật." });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái thành công.",
      data: updatedBorrowBook,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái mượn sách:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật trạng thái." });
  }
};
