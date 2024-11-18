const express = require("express");

const {
  getAll,
  getById,
  add,
  update,
  delete: deleteEmployee,
  login,
  register,
} = require("../controllers/employee.controller");

const router = express.Router();

router.post("/admin/login", login);
router.post("/admin/register", register);

router.get("/", getAll);
router.get("/:id", getById);

router.post("/create", add);
router.put("/:id", update);
router.delete("/:id", deleteEmployee);

module.exports = router;
