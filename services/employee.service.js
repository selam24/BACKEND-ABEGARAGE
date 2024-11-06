// services/employeeService.js
const db = require("../db/connection");
const bcrypt = require("bcrypt");
const validator = require("validator"); // For input sanitization
const DEFAULT_ROLE = "employee"; // Default role assignment

exports.registerEmployee = async (employeeData) => {
  // Sanitize and validate input data
  const sanitizedData = {
    firstName: validator.escape(employeeData.employee_first_name),
    lastName: validator.escape(employeeData.employee_last_name),
    phone: validator.escape(employeeData.employee_phone),
    email: validator.normalizeEmail(employeeData.employee_email),
    password: employeeData.employee_password, // Password is hashed, so not sanitized
    position: validator.escape(employeeData.employee_position), // Add position with sanitization
    active: employeeData.active_employee || 1, // Default status is 1 (active)
  };

  // Validation checks for required fields
  if (
    !sanitizedData.firstName ||
    !sanitizedData.lastName ||
    !sanitizedData.phone ||
    !sanitizedData.email ||
    !sanitizedData.password ||
    !sanitizedData.position // Check for position as well
  ) {
    const error = new Error("Please provide all required fields");
    error.statusCode = 400;
    throw error;
  }

  // Check if email is already registered
  const existingUser = await new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM employees WHERE email = ?",
      [sanitizedData.email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });

  if (existingUser.length > 0) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);

    // Insert the new employee into the database
    const query =
      "INSERT INTO employees (first_name, last_name, phone, email, password, position, active_status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      sanitizedData.firstName,
      sanitizedData.lastName,
      sanitizedData.phone,
      sanitizedData.email,
      hashedPassword,
      sanitizedData.position, // Include position in the query
      sanitizedData.active,
      DEFAULT_ROLE,
    ];

    // Execute the query and return a promise with the result
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: "Employee created successfully",
            success: true,
            data: {
              id: result.insertId,
              firstName: sanitizedData.firstName,
              lastName: sanitizedData.lastName,
              phone: sanitizedData.phone,
              email: sanitizedData.email,
              position: sanitizedData.position, // Include position in the response data
              active_status: sanitizedData.active,
            },
          });
        }
      });
    });
  } catch (error) {
    throw new Error("Failed to register employee");
  }
};
