const { ObjectId } = require("mongodb");

class EmployeeService {
  constructor(client) {
    this.col = client.db("contactbook").collection("employees");
  }
  /*
   *
   * TÊN BẢNG: NHANVIEN
   * MSNV
   * HOTENNV
   * USERNAME
   * PASSWORD
   * CHUCVU
   * DIACHI
   * SODIENTHOAI
   *
   */
  async login(data) {
    const user = await this.col.findOne({
      username: data.username,
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
      username: data.username,
    });

    if (user) {
      return "User already exists";
    }

    const result = await this.col.insertOne({
      ...data,
      position: "",
      address: "",
      phone: "",
    });
    return result;
  }

  async getAll() {
    const data = await this.col.find().toArray();
    return data;
  }
  async getById(id) {
    const data = await this.col.findOne({
      _id: new ObjectId(id),
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

  async add(data) {
    const result = await this.col.insertOne(data);
    return result;
  }
}

module.exports = EmployeeService;
