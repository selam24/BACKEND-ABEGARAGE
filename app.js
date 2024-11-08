// app.js
const express = require("express");
require("dotenv").config(); // Load environment variables from .env
const cors = require("cors");

// Create a variable to store the port number
const PORT = process.env.PORT || 3000; // Default to 3000 if no PORT is set in .env

// Create the web server
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use express.json middleware to parse JSON request bodies
app.use(express.json());

// Import routes (ensure you have an employee.routes.js file)
const employeeRoutes = require("./routes/employee.routes");

// Use routes with a prefix (if needed)
app.use("/api", employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
