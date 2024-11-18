const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.col = client.db("contactbook").collection("books");
  }

  // Các phương thức khác như getAllBooks, getBookById, deleteBook, updateBook, addBook

  async getAllBooks(payload) {
    let filter = {};

    if (payload.name) {
      filter = { $text: { $search: payload.name } };
    }

    const books = await this.col.aggregate([{ $match: filter }]).toArray();
    return books;
  }

  async getBookById(id) {
    const book = await this.col.findOne({
      _id: new ObjectId(id),
    });
    return book;
  }

  async deleteBook(id) {
    const data = await this.col.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return data;
  }

  async updateBook(id, data) {
    const book = await this.col.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: data },
      {
        returnDocument: "after",
      }
    );
    return book;
  }

  async addBook(data) {
    const book = await this.col.insertOne({
      ...data,
      publisher: new ObjectId(data.publisher),
    });
    return book;
  }

  async decreaseQuantity(bookId) {
    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $inc: { quantity: -1 } },
      { returnDocument: "after" }
    );

    if (result.value && result.value.quantity >= 0) {
      return result.value;
    }
    return null;
  }

  async increaseQuantity(bookId) {
    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $inc: { quantity: 1 } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return result.value;
    }
    return null;
  }

  async updateBookQuantity(bookId, change) {
    try {
      // Lấy cuốn sách từ cơ sở dữ liệu
      const book = await this.booksCol.findOne({ _id: new ObjectId(bookId) });

      if (!book) {
        throw new Error("Không tìm thấy sách");
      }

      // Chuyển quantity từ string sang number và thực hiện phép toán
      let currentQuantity = Number(book.quantity); // Chuyển quantity từ string thành number

      // Kiểm tra nếu giá trị quantity không phải là một số hợp lệ
      if (isNaN(currentQuantity)) {
        throw new Error("Số lượng sách không hợp lệ");
      }

      // Tính toán số lượng mới sau khi cộng hoặc trừ
      const updatedQuantity = currentQuantity + change;

      // Kiểm tra nếu số lượng sách sau khi cập nhật nhỏ hơn 0
      if (updatedQuantity < 0) {
        throw new Error("Số lượng sách không thể nhỏ hơn 0");
      }

      // Cập nhật lại số lượng sách trong cơ sở dữ liệu (vẫn lưu dưới dạng string)
      const result = await this.booksCol.updateOne(
        { _id: new ObjectId(bookId) }, // Tìm cuốn sách theo ID
        { $set: { quantity: updatedQuantity.toString() } } // Cập nhật quantity về dạng string
      );

      if (result.modifiedCount === 0) {
        throw new Error("Không thể cập nhật số lượng sách");
      }

      return "Cập nhật số lượng sách thành công"; // Thông báo khi cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sách:", error);
      return null; // Trả về null nếu có lỗi
    }
  }

  // Lấy thông tin mượn sách (Giả sử có dịch vụ lấy thông tin mượn sách từ cơ sở dữ liệu)
  async getBorrowBookById(borrowBookId) {
    // Giả sử có một phương thức gọi đến dịch vụ borrowBook để lấy thông tin
    const borrowBook = await borrowBookService.getById(borrowBookId);
    return borrowBook;
  }

  async searchBooks(query) {
    const books = await this.col
      .find({ name: { $regex: query, $options: "i" } }) // Tìm kiếm không phân biệt hoa thường
      .limit(10) // Giới hạn số kết quả trả về
      .toArray();
    console.log("Kết quả tìm kiếm trong MongoDB:", books); // Kiểm tra kết quả
    return books;
  }
}

module.exports = BookService;
