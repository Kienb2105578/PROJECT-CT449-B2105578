const express = require("express");

const {
  getAll,
  getById,
  add,
  update,
  delete: deletePublisher,
  searchPublishers,
} = require("../controllers/publisher.controller");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/search", searchPublishers);

router.post("/create", add);
router.put("/:id", update);
router.delete("/:id", deletePublisher);

module.exports = router;
