const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const { isAuthenticated } = require("../middleware/auth");

// Trang chủ - danh sách tin đăng (có tích hợp tìm kiếm)
router.get("/", listingController.index);

// Tìm kiếm tin đăng (redirect từ trang chủ)
router.get("/search", listingController.search);

// Tạo tin đăng mới (yêu cầu đăng nhập)
router.get("/create", isAuthenticated, listingController.showCreate);
router.post("/create", isAuthenticated, listingController.create);

// Chi tiết tin đăng
router.get("/:id", listingController.show);

// Bình luận và đánh giá (AJAX)
router.post("/comment", isAuthenticated, listingController.addCommentAjax);

// Lưu tin
router.post("/:id/save", isAuthenticated, listingController.saveListing);

// Bỏ lưu tin
router.post("/:id/unsave", isAuthenticated, listingController.unsaveListing);

module.exports = router;
