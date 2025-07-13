// Middleware kiểm tra đã đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

// Middleware kiểm tra chưa đăng nhập
const isGuest = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

// Middleware kiểm tra là admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).render("error", {
      message: "Bạn không có quyền truy cập trang này!",
    });
  }
};

module.exports = {
  isAuthenticated,
  isGuest,
  isAdmin,
};
