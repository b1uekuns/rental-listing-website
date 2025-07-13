// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middleware/auth");

// Tất cả routes admin đều yêu cầu quyền admin
router.use(isAdmin);

// Dashboard
router.get("/", adminController.dashboard);

// Quản lý người dùng
router.get("/users", adminController.users);

// Quản lý tin đăng
router.get("/listings", adminController.listings);
router.post("/listings/:id/status", adminController.updateListingStatus);
router.post("/listings/:id/delete", adminController.deleteListing);
router.get("/listings/:id", adminController.listingDetail);

// Comments
router.get("/comments", adminController.comments);
router.post("/comments/:id/delete", adminController.deleteComment);

// Quản lý liên hệ
router.get("/contacts", adminController.contacts);
router.post("/contacts/:id/delete", adminController.deleteContact);

module.exports = router;
