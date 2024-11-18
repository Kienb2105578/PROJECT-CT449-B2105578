const express = require("express");
const ApiError = require("./app/api-error"); // Xử lý lỗi API tùy chỉnh
const bookRouter = require("./app/routes/book.route"); // Định nghĩa các routes cho sách
const publisherRouter = require("./app/routes/publisher.route"); // Định nghĩa các routes cho nhà xuất bản
const readerRouter = require("./app/routes/reader.route"); // Định nghĩa các routes cho độc giả
const employeeRouter = require("./app/routes/employee.route"); // Định nghĩa các routes cho nhân viên
const borrowBookRouter = require("./app/routes/borrowBook.route"); // Định nghĩa các routes cho mượn sách
const authRouter = require("./app/routes/auth.route");
const emailRouter = require("./app/routes/email.route");
// Định nghĩa các routes cho xác thực

const cors = require("cors");

const app = express();

// Cấu hình CORS
app.use(cors());

// Middleware để phân tích body yêu cầu JSON
app.use(express.json());

// Định nghĩa các routes API
app.use("/api/auth", authRouter); // API xác thực
app.use("/api/book", bookRouter); // API sách
app.use("/api/publisher", publisherRouter); // API nhà xuất bản
app.use("/api/reader", readerRouter); // API độc giả
app.use("/api/employee", employeeRouter); // API nhân viên
app.use("/api/borrow-book", borrowBookRouter);
app.use("/api/send-email", emailRouter); // API mượn sách

// Middleware xử lý lỗi nếu đường dẫn không hợp lệ
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi chung cho API
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app; // Xuất ứng dụng Express để sử dụng ở nơi khác
