const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { setAuthCookie, clearAuthCookie } = require("../middleware/authToken");

const authController = {
  // Hiển thị form đăng nhập
  showLogin: (req, res) => {
    res.render("auth/login", {
      title: "Đăng nhập",
      user: req.session.user,
    });
  },

  // Xử lý đăng nhập
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt:", { username, password: "***" });

      const [users] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
      );

      if (users.length === 0) {
        console.log("User not found:", username);
        req.session.authError = "Tên đăng nhập hoặc mật khẩu không đúng!";
        return req.session.save(() => res.redirect("/auth/login"));
      }

      const user = users[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        console.log("Password mismatch for user:", username);
        req.session.authError = "Tên đăng nhập hoặc mật khẩu không đúng!";
        return req.session.save(() => res.redirect("/auth/login"));
      }

      req.session.user = user;
      setAuthCookie(res, user);

      return req.session.save(() => {
        if (user.role === "admin") {
          return res.redirect("/admin");
        }
        return res.redirect("/");
      });
    } catch (error) {
      console.error("Login error:", error);
      req.session.authError = "Đăng nhập tạm thời gián đoạn, vui lòng thử lại.";
      return req.session.save(() => res.redirect("/auth/login"));
    }
  },

  // Hiển thị form đăng ký
  showRegister: (req, res) => {
    res.render("auth/register", {
      title: "Đăng ký",
      user: req.session.user,
    });
  },

  // Xử lý đăng ký
  register: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        confirm_password,
        full_name,
        phone_number,
      } = req.body;

      // Kiểm tra xác nhận mật khẩu
      if (password !== confirm_password) {
        req.session.error = "Mật khẩu xác nhận không khớp";
        return req.session.save(() => res.redirect("/auth/register"));
      }

      // Kiểm tra username đã tồn tại
      const [existingUsers] = await pool.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email],
      );

      if (existingUsers.length > 0) {
        req.session.error = "Tên đăng nhập hoặc email đã tồn tại";
        return req.session.save(() => res.redirect("/auth/register"));
      }

      // Mã hóa password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Tạo user mới
      await pool.query(
        "INSERT INTO users (username, email, password_hash, full_name, phone_number) VALUES (?, ?, ?, ?, ?)",
        [username, email, password_hash, full_name, phone_number],
      );

      req.session.success = "Đăng ký thành công, vui lòng đăng nhập";
      return req.session.save(() => res.redirect("/auth/login"));
    } catch (error) {
      console.error("Register error:", error);
      req.session.error = "Đã xảy ra lỗi, vui lòng thử lại";
      return req.session.save(() => res.redirect("/auth/register"));
    }
  },

  // Đăng xuất
  logout: (req, res) => {
    clearAuthCookie(res);
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};

module.exports = authController;
