const express = require("express");

const {
  getAll,
  getById,
  getByUserAndBookId,
  add,
  update,
  delete: deleteBorrowBook,
  updateStatus,
} = require("../controllers/borrowBook.controller");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/:id", getByUserAndBookId);

router.post("/create", add);
router.put("/:id", update);
router.delete("/:id", deleteBorrowBook);
router.put("/:id", updateStatus);

module.exports = router;
