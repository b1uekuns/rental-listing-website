const pool = require("../config/database");

const contactController = {
  // Hiển thị form liên hệ
  showForm: (req, res) => {
    res.render("contact", {
      title: "Liên hệ",
      user: req.session.user,
    });
  },

  // Xử lý gửi liên hệ
  submit: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      await pool.query(
        "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, subject, message]
      );
      req.session.success =
        "Gửi liên hệ thành công, chúng tôi sẽ phản hồi sớm nhất có thể";
      res.redirect("/contact");
    } catch (error) {
      console.error("Submit contact error:", error);
      req.session.error = "Đã xảy ra lỗi, vui lòng thử lại";
      res.redirect("/contact");
    }
  },

  // Xem danh sách liên hệ (admin)
  list: async (req, res) => {
    try {
      const [contacts] = await pool.query(`
                SELECT * FROM contacts
                ORDER BY created_at DESC`);
                
      res.render("admin/contacts", {
        title: "Quản lý liên hệ",
        contacts,
        user: req.session.user,
      });
    } catch (error) {
      console.error("List contacts error:", error);
      res
        .status(500)
        .render("error", { title: "Lỗi", message: "Đã xảy ra lỗi" });
    }
  },

  // Xóa liên hệ (admin)
  delete: async (req, res) => {
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
};

module.exports = contactController;
