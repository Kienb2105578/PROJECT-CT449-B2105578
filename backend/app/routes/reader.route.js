const express = require("express");

const {
  getAll,
  getById,
  add,
  update,
  delete: deleteReader,
} = require("../controllers/reader.controller");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post("/create", add);
router.put("/:id", update);
router.delete("/:id", deleteReader);

module.exports = router;
