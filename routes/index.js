const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    session_user: req.session?.user
      ? {
          id: req.session.user.id,
          username: req.session.user.username,
          role: req.session.user.role,
        }
      : null,
  });
});

// Debug endpoint: show all users in database
router.get("/debug-users", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, role, email, created_at FROM users LIMIT 10",
    );
    res.json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

// Trang chủ
router.get("/", async (req, res) => {
  try {
    // Kiểm tra kết nối database
    let listings = [];
    let popupListing = null;
    let districts = [];

    try {
      // Lấy danh sách tin đăng mới nhất
      const [listingsResult] = await pool.query(`
              SELECT l.*, d.name as district_name
              FROM listings l
              JOIN districts d ON l.district_id = d.id
              WHERE l.status = 'available'
              ORDER BY l.created_at DESC
              LIMIT 6
          `);
      listings = listingsResult;

      // Lấy một tin đăng ngẫu nhiên cho popup
      const [popupResult] = await pool.query(`
              SELECT l.*, d.name as district_name
              FROM listings l
              JOIN districts d ON l.district_id = d.id
              WHERE l.status = 'available'
              ORDER BY RAND()
              LIMIT 1
          `);
      popupListing = popupResult[0] || null;

      // Lấy danh sách quận/huyện
      const [districtsResult] = await pool.query("SELECT * FROM districts");
      districts = districtsResult;
    } catch (dbError) {
      console.error("Database error:", dbError.message);
      // Tiếp tục với dữ liệu rỗng nếu database không khả dụng
    }

    res.render("home", {
      title: "Trang chủ",
      listings,
      popupListing,
      districts,
      isAuthenticated: res.locals.isAuthenticated,
      isAdmin: res.locals.isAdmin,
    });
  } catch (error) {
    console.error("Home page error:", error);
    res.status(500).render("error", { message: "Đã xảy ra lỗi" });
  }
});

module.exports = router;
