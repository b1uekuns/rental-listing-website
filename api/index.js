// Main app entry point for Vercel
module.exports = (req, res) => {
  try {
    const app = require("../app");
    return app(req, res);
  } catch (error) {
    console.error("Serverless bootstrap error:", error);
    return res.status(500).json({
      status: "error",
      message: "Function bootstrap failed",
    });
  }
};
