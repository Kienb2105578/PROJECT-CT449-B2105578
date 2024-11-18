const { ObjectId } = require("mongodb");

class ReaderService {
  constructor(client) {
    this.col = client.db("contactbook").collection("users");
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

module.exports = ReaderService;
