const ApiError = require("../api-error");
const EmailService = require("../services/email.service"); // Giả sử bạn có một service gửi email riêng biệt

// Hàm gửi email
exports.sendEmailController = async (req, res, next) => {
  try {
    const { to, subject, text } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!to || !subject || !text) {
      return next(
        new ApiError(400, "Missing required fields (to, subject, or text)")
      );
    }

    // Gửi email
    await EmailService.sendEmail(to, subject, text);

    // Nếu gửi email thành công
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    // Xử lý lỗi nếu có trong quá trình gửi email
    console.error("Error sending email:", error);
    return next(new ApiError(500, "An error occurred while sending the email"));
  }
};
