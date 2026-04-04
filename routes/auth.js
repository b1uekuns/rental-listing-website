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

// Reset auth state (xóa sạch cookie + session khi kẹt redirect)
router.get("/reset", (req, res) => {
  const { clearAuthCookie } = require("../middleware/authToken");
  clearAuthCookie(res);
  if (req.session) {
    req.session.user = null;
    req.session.error = null;
    req.session.success = null;
    req.session.authError = null;
  }
  res.redirect("/auth/login");
});

module.exports = router;
