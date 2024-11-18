const { ObjectId } = require("mongodb");

class PublisherService {
  constructor(client) {
    this.col = client.db("contactbook").collection("publishers");
  }

  /*
   *
   * TÊN BẢNG: NHAXUATBAN
   * MANNXB
   * TENNXB
   * DIACHI
   *
   */

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

  async searchPublishers(req, res, next) {
    try {
      const { query } = req.query; // Lấy truy vấn từ query params
      const filter = {
        name: { $regex: query, $options: "i" }, // Tìm theo tên nhà xuất bản
      };
      const publishers = await Publisher.find(filter); // Truy vấn tìm kiếm
      res.status(200).json(publishers);
    } catch (error) {
      next(new ApiError(500, "Error retrieving publishers"));
    }
  }
}

module.exports = PublisherService;
