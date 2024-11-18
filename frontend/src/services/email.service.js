import createApiClient from "./api.service";

class EmailService {
  constructor(baseUrl = "/api") {
    this.api = createApiClient(baseUrl);
  }

  // Hàm gửi email
  async sendEmail(to, subject, text) {
    try {
      const res = await this.api.post("/send-email", { to, subject, text });
      return res.data;
    } catch (error) {
      console.log("Lỗi khi gửi email:", error);
      return null;
    }
  }
}

export default new EmailService();
