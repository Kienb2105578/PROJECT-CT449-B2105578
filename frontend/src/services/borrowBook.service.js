import createApiClient from "./api.service";

class BorrowBookService {
  constructor(baseUrl = "/api/borrow-book") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    return (await this.api.post("/create", data)).data;
  }

  async getAll(searchQuery = "") {
    return (await this.api.get("/" + "?" + searchQuery)).data;
  }

  async updateStatus(id, data) {
    return await this.api.put(`/${id}`, data).data;
  }

  async update(id, data) {
    return await this.api.put(`/${id}`, data).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async getById(id) {
    return (await this.api.get("/" + id)).data;
  }
  async getByUserAndBookId(reader_id, book_id) {
    const query = `reader_id=${reader_id}&book_id=${book_id}`;
    return (await this.api.get(`/?${query}`)).data;
  }
}

export default new BorrowBookService();
