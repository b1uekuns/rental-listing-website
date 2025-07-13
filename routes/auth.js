const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isGuest } = require("../middleware/auth");

// Đăng nhập
router.get("/login", isGuest, authController.showLogin);
router.post("/login", isGuest, authController.login);

// Đăng ký
router.get("/register", isGuest, authController.showRegister);
router.post("/register", isGuest, authController.register);

// Đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
