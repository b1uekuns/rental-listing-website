const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { setAuthCookie } = require("../middleware/authToken");

// Debug endpoint: simulates login flow step-by-step
router.post("/debug-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Step 1: Query user
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.json({
        status: "error",
        step: "user_query",
        message: `User '${username}' not found in database`,
      });
    }

    const user = users[0];

    // Step 2: Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.json({
        status: "error",
        step: "password_compare",
        message: "Password does not match",
        hashedInput: (await bcrypt.hash(password, 10)).substring(0, 20),
        storedHash: user.password_hash.substring(0, 20),
      });
    }

    // Step 3: Set session
    req.session.user = user;
    setAuthCookie(res, user);

    return req.session.save(() => {
      res.json({
        status: "success",
        step: "login_complete",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        session_id: req.sessionID,
        message: `Login successful for ${username}`,
      });
    });
  } catch (error) {
    console.error("Debug login error:", error);
    res.json({
      status: "error",
      step: "exception",
      message: error.message,
      stack: error.stack,
    });
  }
});

// List all users (for debugging)
router.get("/debug-users", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, role, created_at FROM users",
    );
    res.json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
