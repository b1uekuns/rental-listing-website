const mysql = require("mysql2/promise");
require("dotenv").config();

// Cấu hình database pool
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rental_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_SSL === "true") {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(dbConfig);

// Test database connection với error handling tốt hơn
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
    return true;
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    return false;
  }
};

// Test connection khi khởi động
testConnection();

module.exports = pool;
