const pool = require("../config/database");

const commentController = {
  // Thêm bình luận mới
  add: async (req, res) => {
    try {
      const { listing_id } = req.params;
      const { content, rating } = req.body;
      const user_id = req.session.user.id;

      await pool.query(
        "INSERT INTO comments (listing_id, user_id, content, rating) VALUES (?, ?, ?, ?)",
        [listing_id, user_id, content, rating]
      );

      req.session.success = "Bình luận thành công";
      res.redirect(`/listings/${listing_id}`);
    } catch (error) {
      console.error("Add comment error:", error);
      req.session.error = "Đã xảy ra lỗi";
      res.redirect(`/listings/${req.params.listing_id}`);
    }
  },

  // Xóa bình luận
  delete: async (req, res) => {
    try {
      const { id, listing_id } = req.params;
      const user_id = req.session.user.id;

      // Kiểm tra quyền xóa (chỉ admin mới được xóa)
      const [comments] = await pool.query(
        "SELECT * FROM comments WHERE id = ?",
        [id]
      );

      if (comments.length === 0) {
        req.session.error = "Không tìm thấy bình luận";
        return res.redirect(`/listings/${listing_id}`);
      }

      const comment = comments[0];
      if (req.session.user.role !== "admin") {
        req.session.error = "Bạn không có quyền xóa bình luận này";
        return res.redirect(`/listings/${listing_id}`);
      }

      await pool.query("DELETE FROM comments WHERE id = ?", [id]);
      req.session.success = "Xóa bình luận thành công";
      res.redirect(`/listings/${listing_id}`);
    } catch (error) {
      console.error("Delete comment error:", error);
      req.session.error = "Đã xảy ra lỗi";
      res.redirect(`/listings/${req.params.listing_id}`);
    }
  },
};

module.exports = commentController;
