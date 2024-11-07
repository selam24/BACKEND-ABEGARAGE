// routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validateEmployeeRegistration,
} = require("../middlewares/validationMiddleware");

// Use validation middleware in the registration route
// Route Path: The path /employee is defined as a POST route, meaning it will handle employee registration requests that contain data (e.g., in JSON format).
// Middleware (validateEmployeeRegistration): Runs first and validates the request data to ensure it meets requirements (e.g., required fields, correct formats). If validation fails, it returns an error response; if it succeeds, the request is passed on.
// Controller (employeeController.registerEmployee): Executes the registration logic, including saving the new employee to the database. This method handles the main business logic after validation.
router.post(
  "/employee",
  validateEmployeeRegistration,
  employeeController.registerEmployee
);

module.exports = router;
