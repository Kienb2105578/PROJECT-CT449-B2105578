const { ObjectId } = require("mongodb");

class BorrowBookService {
  constructor(client) {
    this.col = client.db("contactbook").collection("borrowBooks");
    this.booksCol = client.db("contactbook").collection("books"); // Thêm collection books
  }

  async getAll(payload) {
    const filter = {};
    if (payload.user_id) {
      filter["reader_id"] = new ObjectId(payload.user_id);
    }
    const data = await this.col
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reader_id",
            foreignField: "_id",
            as: "reader",
          },
        },
        {
          $unwind: "$reader",
        },
        {
          $unwind: "$book",
        },
      ])
      .toArray();
    return data;
  }

  async getById(id) {
    const data = await this.col.findOne({
      _id: new ObjectId(id),
    });
    return data;
  }
  async getByUserAndBookId(reader_id, book_id) {
    const data = await this.col.findOne({
      reader_id: new ObjectId(reader_id), // Chuyển user_id sang ObjectId nếu cần
      book_id: new ObjectId(book_id), // Chuyển book_id sang ObjectId nếu cần
    });
    return data;
  }

  async delete(id) {
    const data = await this.col.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return data;
  }

  async update(id, data) {
    const result = await this.col.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: data },
      {
        returnDocument: "after",
      }
    );
    return result;
  }
  // async updateStatus(id, status) {
  //   const result = await this.col.findOneAndUpdate(
  //     { _id: new ObjectId(id) },
  //     { $set: { status } },
  //     { returnDocument: "after" }
  //   );
  //   return result.value;
  // }

  async updateStatus(id, status) {
    const borrowBook = await this.col.findOne({ _id: new ObjectId(id) });

    if (!borrowBook) {
      throw new Error("Không tìm thấy yêu cầu mượn sách.");
    }

    const book = await this.booksCol.findOne({
      _id: new ObjectId(borrowBook.book_id),
    });

    if (!book) {
      throw new Error("Không tìm thấy sách.");
    }

    let updatedQuantity;

    if (status === "Đang Mượn") {
      updatedQuantity = Number(book.quantity) - 1;
      if (updatedQuantity < 0) {
        throw new Error("Số lượng sách không đủ để mượn.");
      }
    }
    if (status === "Đã Trả" || status === "Đã Hủy") {
      updatedQuantity = Number(book.quantity) + 1;
    }

    console.log("Book info before update:", book);
    console.log("Updated quantity:", updatedQuantity);

    const bookUpdateResult = await this.booksCol.updateOne(
      { _id: new ObjectId(borrowBook.book_id) },
      { $set: { quantity: updatedQuantity.toString() } }
    );

    if (bookUpdateResult.modifiedCount === 0) {
      throw new Error("Không thể cập nhật số lượng sách.");
    }

    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      throw new Error("Cập nhật trạng thái thất bại.");
    }

    return {
      message: `Cập nhật trạng thái thành công: ${status}`,
      updatedData: result.value,
    };
  }

  // async add(data) {
  //   try {
  //     // Kiểm tra xem người đọc đã mượn sách này chưa
  //     const borrowBook = await this.col.findOne({
  //       book_id: new ObjectId(data.book_id),
  //       reader_id: new ObjectId(data.reader_id),
  //     });

  //     if (borrowBook) {
  //       return "Book already borrowed by this user";
  //     }

  //     // Thêm yêu cầu mượn sách
  //     const result = await this.col.insertOne({
  //       ...data,
  //       book_id: new ObjectId(data.book_id),
  //       reader_id: new ObjectId(data.reader_id),
  //     });

  //     return result;
  //   } catch (error) {
  //     console.error("Error in add method:", error);
  //     throw error;
  //   }
  // }
  async add(data) {
    try {
      // Kiểm tra xem sách đã được mượn bởi người dùng này chưa, với trạng thái hợp lệ
      const existingBorrow = await this.col.findOne({
        book_id: new ObjectId(data.book_id),
        reader_id: new ObjectId(data.reader_id),
        status: { $nin: ["Đã Trả", "Đã Hủy"] }, // Kiểm tra trạng thái không phải là "Đã Trả" hoặc "Đã Hủy"
      });

      if (existingBorrow) {
        return {
          error: true,
          message:
            "Book already borrowed by this user and is not returned or canceled yet.",
        };
      }

      // Kiểm tra số lượng sách còn lại
      const book = await this.booksCol.findOne({
        _id: new ObjectId(data.book_id),
      });
      if (book && Number(book.quantity) > 0) {
        const updatedQuantity = Number(book.quantity) - 1;

        // Cập nhật số lượng sách
        const bookUpdateResult = await this.booksCol.updateOne(
          { _id: new ObjectId(data.book_id) },
          { $set: { quantity: updatedQuantity.toString() } }
        );

        if (bookUpdateResult.modifiedCount === 0) {
          return { error: true, message: "Unable to update book quantity" };
        }
      } else {
        return { error: true, message: "This book is currently unavailable" };
      }

      // Thêm yêu cầu mượn sách
      const result = await this.col.insertOne({
        ...data,
        book_id: new ObjectId(data.book_id),
        reader_id: new ObjectId(data.reader_id),
        status: "Chờ Xác Nhận", // Trạng thái khi mượn sách
      });

      if (!result.acknowledged) {
        return { error: true, message: "Failed to borrow the book" };
      }

      return {
        success: true,
        message: "Book borrowed successfully",
        data: result,
      };
    } catch (error) {
      console.error("Error in add method:", error);
      return { error: true, message: "An error occurred, please try again." };
    }
  }
}

module.exports = BorrowBookService;
