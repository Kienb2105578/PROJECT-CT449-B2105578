const { ObjectId } = require("mongodb");

class AuthService {
  constructor(client) {
    this.col = client.db("contactbook").collection("users");
  }

  /* TÊN BẢNG: DOCGIA
   * MADOCGIA
   * HOTEN
   * EMAIL
   * PASSWORD
   * NGAYSINH
   * PHAI
   * DIACHI
   * DIENTHOAI
   */

  async login(data) {
    const user = await this.col.findOne({
      email: data.email,
    });

    if (!user) {
      return null;
    }

    if (user.password !== data.password) {
      return "Invalid password";
    }

    return user;
  }
  async register(data) {
    const user = await this.col.findOne({
      email: data.email,
    });

    if (user) {
      return "User already exists";
    }

    const insertUser = await this.col.insertOne({
      email: data.email,
      username: data.username,
      password: data.password,
      dateOfBirth: data.dateOfBirth, // Ngày sinh (theo kiểu ISO string)
      gender: data.gender || "male", // Giới tính (mặc định là male)
      phone: data.phone || "", // Điện thoại (mặc định rỗng)
      address: data.address || "", // Địa chỉ (mặc định rỗng)
    });

    if (!insertUser?.acknowledged) {
      return "An error ocurred";
    }

    const result = await this.col.findOne({
      _id: insertUser.insertedId,
    });

    return result;
  }
}

module.exports = AuthService;
