// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const {
  validateEmployeeRegistration,
} = require("../middleware/validationMiddleware");

// Use validation middleware in the registration route
router.post(
  "/api/employee",
  validateEmployeeRegistration,
  employeeController.registerEmployee
);

module.exports = router;
