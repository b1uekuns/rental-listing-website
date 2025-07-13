const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isAuthenticated } = require("../middleware/auth");

// Thêm bình luận mới (yêu cầu đăng nhập)
router.post(
  "/listings/:listing_id/comments",
  isAuthenticated,
  commentController.add
);

// Xóa bình luận (yêu cầu đăng nhập)
router.delete(
  "/listings/:listing_id/comments/:id",
  isAuthenticated,
  commentController.delete
);

module.exports = router;
