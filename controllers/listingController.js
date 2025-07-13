const pool = require("../config/database");
const path = require("path");
const listingController = {
  // Hiển thị trang chủ với danh sách tin đăng
  index: async (req, res) => {
    try {
      const { district, property_type, price_range, area, keyword } = req.query;

      let query =`
                SELECT l.*, d.name as district_name, u.full_name as owner_name
                FROM listings l
                JOIN districts d ON l.district_id = d.id
                JOIN users u ON l.user_id = u.id
                WHERE l.status = 'available'`;
      const params = [];

      if (district) {
        query += " AND l.district_id = ?";
        params.push(district);
      }

      if (property_type) {
        query += " AND l.property_type = ?";
        params.push(property_type);
      }

      // Xử lý khoảng giá
      if (price_range) {
        const [min_price, max_price] = price_range.split("-");
        if (min_price) {
          query += " AND l.price >= ?";
          params.push(parseInt(min_price));
        }
        if (max_price) {
          query += " AND l.price <= ?";
          params.push(parseInt(max_price));
        }
      }

      // Xử lý diện tích
      if (area) {
        query += " AND l.area >= ?";
        params.push(parseInt(area));
      }

      if (keyword) {
        query += " AND (l.title LIKE ? OR l.description LIKE ?)";
        params.push(`%${keyword}%`, `%${keyword}%`);
      }

      query += " ORDER BY l.created_at DESC";

      // Chỉ giới hạn 12 tin nếu không có filter nào
      if (!district && !property_type && !price_range && !area && !keyword) {
        query += " LIMIT 12";
      }

      const [listings] = await pool.query(query, params);

      const [districts] = await pool.query(
        "SELECT * FROM districts ORDER BY name"
      );

      // Xác định title dựa trên có filter hay không
      let title = "Trang chủ";
      if (district || property_type || price_range || area || keyword) {
        title = "Kết quả tìm kiếm";
      }

      res.render("listings/index", {
        title,
        listings,
        districts,
        user: req.session.user,
        searchParams: {
          district,
          property_type,
          price_range,
          area,
          keyword,
        },
      });
    } catch (error) {
      console.error("Index error:", error);
      res
        .status(500)
        .render("error", { title: "Lỗi", message: "Đã xảy ra lỗi" });
    }
  },

  // Hiển thị form tạo tin đăng mới
  showCreate: async (req, res) => {
    try {
      const [districts] = await pool.query(
        "SELECT * FROM districts ORDER BY name"
      );
      res.render("listings/create", {
        title: "Đăng tin mới",
        districts,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Show create error:", error);
      res
        .status(500)
        .render("error", { title: "Lỗi", message: "Đã xảy ra lỗi" });
    }
  },

  // Xử lý tạo tin đăng mới
  create: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        area,
        address,
        district_id,
        property_type,
      } = req.body;

      // Xử lý upload ảnh
      let images_urls = [];
      if (req.files && req.files.images) {
        const files = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of files) {
          const uploadPath = path.join(
            __dirname,
            "../public/uploads",
            file.name
          );
          await file.mv(uploadPath); // Lưu file vào thư mục uploads
          images_urls.push(`/uploads/${file.name}`);
        }
      }

      // Tạo tin đăng mới
      const [result] = await pool.query(
        `INSERT INTO listings (
                    user_id, title, description, price, area,
                    address, district_id, property_type, images_urls
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.session.user.id,
          title,
          description,
          price,
          area,
          address,
          district_id,
          property_type,
          JSON.stringify(images_urls),
        ]
      );

      req.session.success = "Đăng tin thành công, đang chờ duyệt";
      res.redirect("/listings");
    } catch (error) {
      console.error("Create error:", error);
      req.session.error = "Đã xảy ra lỗi, vui lòng thử lại";
      res.redirect("/listings/create");
    }
  },

  // Hiển thị chi tiết tin đăng
  show: async (req, res) => {
    try {
      const { id } = req.params;
      // Tăng lượt xem
      await pool.query(
        "UPDATE listings SET view_count = view_count + 1 WHERE id = ?",
        [id]
      );
      // Lấy thông tin tin đăng
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

      // Nếu tin chưa duyệt, chỉ cho chủ tin hoặc admin xem
      const isAdmin = req.session.user && req.session.user.role === "admin";
      if (listing.status !== "available" && !isAdmin) {
        return res.status(403).render("error", {
          title: "Tin chưa duyệt",
          message: "Tin này chưa được duyệt. Vui lòng quay lại sau!",
        });
      }
      // Xử lý images_urls: nếu là mảng thì giữ nguyên, nếu là chuỗi thì parse hoặc split
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
        `SELECT c.*, u.full_name, u.email, u.avatar_url
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.listing_id = ?
         ORDER BY c.created_at DESC`,
        [id]
      );
      res.render("listings/show", {
        title: listing.title,
        listing,
        comments,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Show error:", error);
      res
        .status(500)
        .render("error", { title: "Lỗi", message: "Đã xảy ra lỗi" });
    }
  },

  // Tìm kiếm tin đăng (từ trang chủ)
  search: async (req, res) => {
    try {
      // Redirect đến trang listings với query parameters
      const queryString = new URLSearchParams(req.query).toString();
      res.redirect(`/listings?${queryString}`);
    } catch (error) {
      console.error("Search redirect error:", error);
      res.redirect("/listings");
    }
  },

  // Thêm bình luận và đánh giá qua AJAX
  addCommentAjax: async (req, res) => {
    try {
      const { listing_id, content, rating } = req.body;
      const user_id = req.session.user.id;
      if (!content || !listing_id || !rating) {
        return res.json({
          success: false,
          error: "Vui lòng nhập đầy đủ nội dung và đánh giá!",
        });
      }
      // Kiểm tra từ xấu phía backend (bảo mật)
      const BAD_WORDS = [
        "xấu",
        "bậy",
        "đểu",
        "ngu",
        "dm",
        "đm",
        "cc",
        "fuck",
        "shit",
      ];
      const found = BAD_WORDS.find((w) => content.toLowerCase().includes(w));
      if (found) {
        return res.json({
          success: false,
          error: "Nội dung chứa từ không phù hợp!",
        });
      }
      // Thêm bình luận
      const [result] = await pool.query(
        "INSERT INTO comments (listing_id, user_id, content, rating) VALUES (?, ?, ?, ?)",
        [listing_id, user_id, content, rating]
      );
      // Lấy lại bình luận vừa thêm theo insertId
      const [rows] = await pool.query(
        `SELECT c.*, u.full_name, u.email, u.avatar_url
         FROM comments c JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [result.insertId]
      );
      res.json({ success: true, comment: rows[0] });
    } catch (error) {
      console.error("Add comment error:", error);
      res.json({ success: false, error: "Có lỗi khi gửi bình luận!" });
    }
  },

  // Lưu tin
  saveListing: async (req, res) => {
    try {
      const listing_id = req.params.id;
      const user_id = req.session.user.id;
      // Kiểm tra đã lưu chưa
      const [rows] = await pool.query(
        "SELECT * FROM saved_listings WHERE user_id = ? AND listing_id = ?",
        [user_id, listing_id]
      );
      if (rows.length > 0) {
        if (req.get("X-Requested-With") === "XMLHttpRequest") {
          return res.json({
            success: false,
            message: "Đã lưu!",
          });
        }
        req.session.error = "Đã lưu!";
        return res.redirect(`/listings/${listing_id}`);
      }
      await pool.query(
        "INSERT INTO saved_listings (user_id, listing_id) VALUES (?, ?)",
        [user_id, listing_id]
      );
      if (req.get("X-Requested-With") === "XMLHttpRequest") {
        return res.json({ success: true, message: "Đã lưu tin thành công!" });
      }
      req.session.success = "Đã lưu tin thành công!";
      res.redirect(`/listings/${listing_id}`);
    } catch (error) {
      console.error("Save listing error:", error);
      if (req.get("X-Requested-With") === "XMLHttpRequest") {
        return res.json({ success: false, message: "Có lỗi khi lưu tin!" });
      }
      req.session.error = "Có lỗi khi lưu tin!";
      res.redirect(`/listings/${req.params.id}`);
    }
  },

  // Bỏ lưu tin
  unsaveListing: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.session.user.id;

      await pool.query(
        "DELETE FROM saved_listings WHERE user_id = ? AND listing_id = ?",
        [user_id, id]
      );

      req.session.success = "Đã bỏ lưu tin thành công!";
      res.redirect("/users/saved");
    } catch (error) {
      console.error("Unsave listing error:", error);
      req.session.error = "Có lỗi khi bỏ lưu tin!";
      res.redirect("/users/saved");
    }
  },
};

module.exports = listingController;
