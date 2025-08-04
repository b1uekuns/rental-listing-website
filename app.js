// Tải cấu hình môi trường từ file .env
require("dotenv").config();

// Import các thư viện cần thiết
const express = require("express");
const path = require("path");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối database MySQL
const db = require("./config/database");

// Cấu hình middleware
app.use(express.json()); // P
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: process.env.MAX_FILE_SIZE },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cấu hình session để lưu trạng thái đăng nhập
app.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, "sessions"),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // Session tồn tại 24 giờ
    },
  })
);

// Cấu hình template engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import middleware xử lý thông báo
const { handleSessionMessages } = require("./middleware/messages");

// Middleware tự động truyền thông tin user vào tất cả view
app.use((req, res, next) => {
  res.locals.user = req.session && req.session.user ? req.session.user : null;
  next();
});

// Middleware xử lý thông báo flash (success/error)
app.use(handleSessionMessages);

// Cấu hình thư mục static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình các routes chính
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/listings", require("./routes/listings"));
app.use("/admin", require("./routes/admin"));
app.use("/comments", require("./routes/comments"));
app.use("/contact", require("./routes/contact"));
app.use("/users", require("./routes/user"));

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Đã xảy ra lỗi!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
