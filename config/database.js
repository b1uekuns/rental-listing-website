const mysql = require("mysql2/promise");
require("dotenv").config();

// Cấu hình database pool
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rental_db",
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 5000),
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

// Test connection khi khởi động local; serverless production không nên probe ngay lúc cold start
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

module.exports = pool;
