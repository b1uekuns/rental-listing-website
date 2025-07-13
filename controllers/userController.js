const pool = require("../config/database");

const userController = {
  // Hiển thị trang tin đã lưu
  savedListings: async (req, res) => {
    try {
      const user_id = req.session.user.id;
      const [listings] = await pool.query(
        `SELECT l.*, d.name as district_name
         FROM saved_listings s
         JOIN listings l ON s.listing_id = l.id
         JOIN districts d ON l.district_id = d.id
         WHERE s.user_id = ?
         ORDER BY s.created_at DESC`,
        [user_id]
      );

      res.render("users/saved", {
        title: "Tin đã lưu",
        listings,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Saved listings error:", error);
      res.status(500).render("error", {
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi tải tin đã lưu",
      });
    }
  },
  // Trang thông tin người dùng
  profile: async (req, res) => {
    try {
      const user = req.session.user;
      res.render("users/profile", {
        title: "Thông tin cá nhân",
        user,
      });
    } catch (error) {
      res.status(500).render("error", {
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi tải thông tin cá nhân",
      });
    }
  },
  // Trang tin đã đăng của user
  myListings: async (req, res) => {
    try {
      const user_id = req.session.user.id;
      const [listings] = await pool.query(
        `SELECT l.*, d.name as district_name
         FROM listings l
         JOIN districts d ON l.district_id = d.id
         WHERE l.user_id = ? 
         ORDER BY l.created_at DESC`,
        [user_id]
      );
      res.render("users/my_listings", {
        title: "Tin đã đăng",
        listings,
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).render("error", {
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi tải tin đã đăng",
      });
    }
  },
  // Xử lý cập nhật thông tin cá nhân
  updateProfile: async (req, res) => {
    try {
      const user_id = req.session.user.id;
      const { full_name, email, phone_number } = req.body;
      let avatar_url = req.session.user.avatar_url;
      // Kiểm tra email trùng
      const [emailRows] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, user_id]
      );
      if (emailRows.length > 0) {
        req.session.error = "Email đã được sử dụng bởi tài khoản khác.";
        return res.redirect("/users/profile");
      }
      // Xử lý upload avatar 
      if (req.files && req.files.avatar && req.files.avatar.size > 0) {
        const file = req.files.avatar;
        const ext = file.name.split(".").pop();
        const fileName = `avatar_${user_id}_${Date.now()}.${ext}`;
        const uploadPath = require("path").join(
          __dirname,
          "../public/uploads",
          fileName
        );
        await file.mv(uploadPath);
        avatar_url = `/uploads/${fileName}`;
      }

      // Cập nhật thông tin (không bao gồm mật khẩu)
      const updateQuery = "UPDATE users SET full_name=?, email=?, phone_number=?, avatar_url=? WHERE id=?";
      const params = [full_name, email, phone_number, avatar_url, user_id];

      await pool.query(updateQuery, params);
      // Cập nhật lại session user
      const [users] = await pool.query("SELECT * FROM users WHERE id=?", [
        user_id,
      ]);
      req.session.user = users[0];
      req.session.success = "Cập nhật thông tin cá nhân thành công!";
      res.redirect("/users/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      req.session.error = "Có lỗi khi cập nhật thông tin!";
      res.redirect("/users/profile");
    }
  },
};

module.exports = userController;
