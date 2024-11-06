// Import the express module
const express = require("express");
// Import the dotenv module and call the config method
require("dotenv").config();
// Import the cors module
const cors = require("cors");

// Create a variable to store the port number
const PORT = process.env.PORT || 3000;

// Create the web server
const app = express();

// Use the cors middleware
app.use(cors());

// Use the express.json middleware to parse JSON requests
app.use(express.json());

// Import routes
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
