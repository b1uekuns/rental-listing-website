const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

// Route xem tin đã lưu
router.get("/saved", isAuthenticated, userController.savedListings);
// Route thông tin cá nhân
router.get("/profile", isAuthenticated, userController.profile);
router.post("/profile", isAuthenticated, userController.updateProfile);
// Route tin đã đăng
router.get("/listings", isAuthenticated, userController.myListings);

module.exports = router;
