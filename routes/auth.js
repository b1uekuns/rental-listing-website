const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng nhập
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

// Đăng ký
router.get("/register", authController.showRegister);
router.post("/register", authController.register);

// Đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
