import createApiClient from "./api.service";

class AccountsService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }
  async login(email, password) {
    try {
      const res = await this.api.post("/login", { email, password });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
  async register(data) {
    try {
      const res = await this.api.post("/register", {
        email: data.email,
        username: data.username,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || "male",
        phone: data.phone,
        address: data.address,
      });

      if (res && res.data) {
        return res.data;
      } else {
        this.errorMessage = "Không có dữ liệu trả về từ server.";
        return null;
      }
    } catch (error) {
      this.errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      return null;
    }
  }
}

export default new AccountsService();
