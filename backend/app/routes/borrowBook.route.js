const express = require("express");

const {
  getAll,
  getById,
  add,
  update,
  delete: deleteBorrowBook,
  updateStatus,
} = require("../controllers/borrowBook.controller");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post("/create", add);
router.put("/:id", update);
router.delete("/:id", deleteBorrowBook);
router.put("/:id", updateStatus);

module.exports = router;
