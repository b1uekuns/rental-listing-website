const mysql = require("mysql2/promise");

// Local only: load .env if dotenv is available. In serverless production,
// environment variables should come from platform settings.
try {
  require("dotenv").config();
} catch (err) {
  // Ignore missing dotenv in production bundles.
}

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// Cấu hình database pool
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: toPositiveInt(process.env.DB_PORT, 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rental_db",
  connectTimeout: toPositiveInt(process.env.DB_CONNECT_TIMEOUT, 5000),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (String(process.env.DB_SSL).toLowerCase() === "true") {
  dbConfig.ssl = { rejectUnauthorized: false };
}

let pool;
try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.error("Failed to initialize MySQL pool:", err.message);
  pool = {
    query: async () => {
      throw err;
    },
    getConnection: async () => {
      throw err;
    },
  };
}

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
