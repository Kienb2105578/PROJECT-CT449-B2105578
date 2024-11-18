import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/book") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/create", data)).data;
  }

  async getAll(searchQuery = "") {
    return (await this.api.get("/" + "?" + searchQuery)).data;
  }

  async getById(id) {
    return (await this.api.get("/" + id)).data;
  }

  async update(id, data) {
    return await this.api.put(`/${id}`, data).data;
  }
  async updateBookQuantity(id, data) {
    return await this.api.put(`/${id}`, data).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async searchBooks(searchQuery) {
    try {
      const url = `/search?q=${encodeURIComponent(searchQuery)}`;
      console.log("URL gửi yêu cầu:", url);
      const response = await this.api.get(url);
      console.log("Kết quả trả về:", response.data);

      // Kiểm tra xem có mảng 'books' không
      if (response.data && Array.isArray(response.data.books)) {
        return response.data.books; // Trả về danh sách sách
      } else {
        console.warn("Không có sách nào tìm thấy.");
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      throw error;
    }
  }
}

export default new BookService();
