const express = require("express");
const router = express.Router();

// API endpoint để test
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Rental Listing API",
    status: "running",
  });
});

module.exports = router;
