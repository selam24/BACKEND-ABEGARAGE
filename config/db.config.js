// db.js
require("dotenv").config(); // Load environment variables from .env

const mysql = require("mysql2");

// Create a connection pool to the database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Uncomment if you're using a Unix socket for connection
  // socketPath: process.env.DB_SOCKET
});

// Check the connection
connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected");
    conn.release(); // Always release the connection back to the pool
  }
});

// Export the connection pool for use in other files
module.exports = connection;
