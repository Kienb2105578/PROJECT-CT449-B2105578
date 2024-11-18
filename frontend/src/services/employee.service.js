import createApiClient from "./api.service";

class EmployeesService {
  constructor(baseUrl = "/api/employee") {
    this.api = createApiClient(baseUrl);
  }

  async login(username, password) {
    try {
      const res = await this.api.post("/admin/login", { username, password });
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new EmployeesService();
