// Debug endpoint to check if app loads correctly
const express = require("express");
const path = require("path");

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Simple routes for testing
app.get("/", (req, res) => {
  try {
    res.render("home", {
      title: "Trang chủ",
      listings: [],
      popupListing: null,
      districts: [],
      isAuthenticated: false,
      isAdmin: false,
    });
  } catch (error) {
    console.error("Home render error:", error);
    res.json({
      error: "Cannot render home page",
      message: error.message,
      stack: error.stack,
    });
  }
});

app.get("/debug", (req, res) => {
  res.json({
    message: "Debug endpoint working",
    __dirname,
    viewsPath: path.join(__dirname, "../views"),
    publicPath: path.join(__dirname, "../public"),
    nodeEnv: process.env.NODE_ENV,
  });
});

// Export for Vercel
module.exports = app;
