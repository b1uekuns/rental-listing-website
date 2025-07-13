// routes/contact.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { isAdmin } = require("../middleware/auth");

// Hiển thị form liên hệ
router.get("/", contactController.showForm);

// Xử lý gửi liên hệ
router.post("/", contactController.submit);

// Quản lý liên hệ (admin)
router.get("/admin/contacts", isAdmin, contactController.list);
// Xóa liên hệ (admin) - dùng POST cho form
router.post("/admin/:id/delete", isAdmin, contactController.delete);

module.exports = router;
