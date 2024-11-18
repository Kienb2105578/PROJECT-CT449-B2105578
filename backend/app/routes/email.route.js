// email.routes.js
const express = require("express");
const router = express.Router();
const { sendEmailController } = require("../controllers/email.controller");

// Route để gửi email
router.post("/", sendEmailController);

module.exports = router;
