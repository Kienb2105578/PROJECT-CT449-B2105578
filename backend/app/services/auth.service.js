const bcrypt = require("bcryptjs");
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

  // Đăng nhập
  async login(data) {
    const user = await this.col.findOne({
      email: data.email,
    });

    if (!user) {
      return "User not found";
    }

    // So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      return "Invalid password";
    }

    return user;
  }

  // Đăng ký
  async register(data) {
    const user = await this.col.findOne({
      email: data.email,
    });

    if (user) {
      return "User already exists";
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const insertUser = await this.col.insertOne({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      dateOfBirth: data.dateOfBirth, // Ngày sinh (theo kiểu ISO string)
      gender: data.gender || "male", // Giới tính (mặc định là male)
      phone: data.phone || "", // Điện thoại (mặc định rỗng)
      address: data.address || "", // Địa chỉ (mặc định rỗng)
    });

    if (!insertUser?.acknowledged) {
      return "An error occurred";
    }

    // Lấy lại thông tin người dùng sau khi đã lưu vào CSDL
    const result = await this.col.findOne({
      _id: insertUser.insertedId,
    });

    return result;
  }
}

module.exports = AuthService;
