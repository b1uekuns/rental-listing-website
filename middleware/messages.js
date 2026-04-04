// Middleware để xử lý thông báo lỗi và thành công từ session
const handleSessionMessages = (req, res, next) => {
  // Lấy thông báo từ session
  res.locals.error = req.session.error || null;
  res.locals.authError = req.session.authError || null;
  res.locals.success = req.session.success || null;

  // Xóa thông báo khỏi session sau khi đã lấy
  req.session.error = null;
  req.session.authError = null;
  req.session.success = null;

  next();
};

module.exports = {
  handleSessionMessages,
};
