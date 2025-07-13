const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Trang chủ
router.get("/", async (req, res) => {
  try {
    // Lấy danh sách tin đăng mới nhất
    const [listings] = await pool.query(`
            SELECT l.*, d.name as district_name
            FROM listings l
            JOIN districts d ON l.district_id = d.id
            WHERE l.status = 'available'
            ORDER BY l.created_at DESC
            LIMIT 6
        `);

    // Lấy một tin đăng ngẫu nhiên cho popup
    const [popupListing] = await pool.query(`
            SELECT l.*, d.name as district_name
            FROM listings l
            JOIN districts d ON l.district_id = d.id
            WHERE l.status = 'available'
            ORDER BY RAND()
            LIMIT 1
        `);

    // Lấy danh sách quận/huyện
    const [districts] = await pool.query("SELECT * FROM districts");

    res.render("home", {
      title: "Trang chủ",
      listings,
      popupListing: popupListing[0] || null,
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
