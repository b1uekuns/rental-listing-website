const pool = require("../config/database");

const renderError = (res, message = "Đã xảy ra lỗi") => {
  res.status(500).render("error", { title: "Lỗi", message });
};

const adminController = {
  // Dashboard
  dashboard: async (req, res) => {
    try {
      // Thống kê tổng quan
      const [[stats]] = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM listings WHERE status = 'pending') as new_listings,
          (SELECT COUNT(*) FROM users WHERE created_at >= CURDATE()) as new_users,
          (SELECT COUNT(*) FROM listings) as total_listings,
          (SELECT SUM(view_count) FROM listings) as total_views`);

      // Tin đăng mới nhất
      const [latestListings] = await pool.query(`
                SELECT l.*, u.full_name, d.name as district_name
                FROM listings l
                JOIN users u ON l.user_id = u.id
                JOIN districts d ON l.district_id = d.id
                ORDER BY l.created_at DESC
                LIMIT 5`);

      // Người dùng mới nhất
      const [latestUsers] = await pool.query(`
                SELECT * FROM users
                ORDER BY created_at DESC
                LIMIT 5`);

      res.render("admin/dashboard", {
        title: "Dashboard",
        currentPage: "dashboard",
        new_listings: stats.new_listings,
        new_users: stats.new_users,
        total_listings: stats.total_listings,
        total_views: stats.total_views || 0,
        latestListings,
        latestUsers,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      renderError(res);
    }
  },

  // Quản lý người dùng
  users: async (req, res) => {
    try {
      const [users] = await pool.query(`
                SELECT * FROM users
                ORDER BY created_at DESC`);

      res.render("admin/users", {
        title: "Quản lý người dùng",
        currentPage: "users",
        users,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Users error:", error);
      renderError(res);
    }
  },

  // Quản lý tin đăng
  listings: async (req, res) => {
    try {
      const status = req.query.status || "all";
      let whereClause = "";
      let queryParams = [];

      if (status !== "all") {
        whereClause = "WHERE l.status = ?";
        queryParams.push(status);
      }

      // Lấy danh sách tin đăng
      const listingsQuery = `
        SELECT l.*, u.full_name, d.name as district_name
        FROM listings l
        JOIN users u ON l.user_id = u.id
        JOIN districts d ON l.district_id = d.id
        ${whereClause}
        ORDER BY l.created_at DESC`;
      const [listings] = await pool.query(listingsQuery, queryParams);

      res.render("admin/listings", {
        title: "Quản lý tin đăng",
        currentPage: "listings",
        listings,
        user: req.session.user,
        status,
      });
    } catch (error) {
      console.error("Listings error:", error);
      renderError(res);
    }
  },

  // Cập nhật trạng thái tin đăng
  updateListingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatus = ["pending", "available", "rejected", "rented"];
      if (!allowedStatus.includes(status)) {
        req.session.error = "Trạng thái không hợp lệ!";
        return res.redirect("/admin/listings");
      }
      await pool.query("UPDATE listings SET status = ? WHERE id = ?", [
        status,
        id,
      ]);
      req.session.success = "Cập nhật trạng thái thành công";
      res.redirect("/admin/listings");
    } catch (error) {
      console.error("Update status error:", error);
      req.session.error = "Đã xảy ra lỗi";
      res.redirect("/admin/listings");
    }
  },

  // Xóa tin đăng
  deleteListing: async (req, res) => {
    try {
      const { id } = req.params;
      // Xóa các bản ghi liên quan theo thứ tự
      // 1. Xóa các bình luận liên quan
      await pool.query("DELETE FROM comments WHERE listing_id = ?", [id]);
      // 2. Xóa các tin đăng đã lưu liên quan
      await pool.query("DELETE FROM saved_listings WHERE listing_id = ?", [id]);
      // 3. Xóa tin đăng
      const [result] = await pool.query("DELETE FROM listings WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows > 0) {
        req.session.success = "Xóa tin đăng thành công";
      } else {
        req.session.error = "Không tìm thấy tin đăng để xóa";
      }

      res.redirect("/admin/listings");
    } catch (error) {
      console.error("Delete listing error:", error);
      req.session.error = "Đã xảy ra lỗi khi xóa tin đăng: " + error.message;
      res.redirect("/admin/listings");
    }
  },

  // Quản lý bình luận
  comments: async (req, res) => {
    try {
      // Lấy tất cả bình luận
      const [comments] = await pool.query(
        `SELECT c.*, u.full_name, l.title as listing_title
         FROM comments c
         JOIN users u ON c.user_id = u.id
         JOIN listings l ON c.listing_id = l.id
         ORDER BY c.created_at DESC`
      );

      res.render("admin/comments", {
        title: "Quản lý bình luận",
        currentPage: "comments",
        comments,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Comments error:", error);
      renderError(res);
    }
  },
  // Xóa bình luận
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM comments WHERE id = ?", [id]);
      req.session.success = "Xóa bình luận thành công";
      res.redirect("/admin/comments");
    } catch (error) {
      console.error("Delete comment error:", error);
      req.session.error = "Đã xảy ra lỗi";
      res.redirect("/admin/comments");
    }
  },

  // Quản lý liên hệ
  contacts: async (req, res) => {
    try {
      // Lấy tất cả liên hệ
      const [contacts] = await pool.query(`
        SELECT * FROM contacts
        ORDER BY created_at DESC
      `);

      res.render("admin/contacts", {
        title: "Quản lý liên hệ",
        currentPage: "contacts",
        contacts,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Contacts error:", error);
      renderError(res);
    }
  },

  // Xóa liên hệ
  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
      req.session.success = "Xóa liên hệ thành công";
      res.redirect("/admin/contacts");
    } catch (error) {
      console.error("Delete contact error:", error);
      req.session.error = "Đã xảy ra lỗi";
      res.redirect("/admin/contacts");
    }
  },

  // Chi tiết tin đăng
  listingDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const [listings] = await pool.query(
        `SELECT l.*, d.name as district_name, u.full_name as owner_name, u.phone_number, u.id as owner_id
         FROM listings l
         JOIN districts d ON l.district_id = d.id
         JOIN users u ON l.user_id = u.id
         WHERE l.id = ?`,
        [id]
      );
      if (listings.length === 0) {
        return res.status(404).render("error", {
          title: "Lỗi",
          message: "Không tìm thấy tin đăng",
        });
      }
      const listing = listings[0];
      // Xử lý images_urls
      let imgs = listing.images_urls;
      if (Array.isArray(imgs)) {
        listing.images_urls = imgs;
      } else if (typeof imgs === "string" && imgs.trim().startsWith("[")) {
        try {
          listing.images_urls = JSON.parse(imgs);
        } catch (e) {
          listing.images_urls = [];
        }
      } else if (typeof imgs === "string" && imgs.trim() !== "") {
        listing.images_urls = imgs.split(",").map((s) => s.trim());
      } else {
        listing.images_urls = [];
      }
      // Lấy bình luận
      const [comments] = await pool.query(
        `SELECT c.*, u.full_name, u.avatar_url
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.listing_id = ?
         ORDER BY c.created_at DESC`,
        [id]
      );
      res.render("admin/listing_detail", {
        title: listing.title,
        listing,
        comments,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Admin listing detail error:", error);
      renderError(res);
    }
  },
};

module.exports = adminController;
