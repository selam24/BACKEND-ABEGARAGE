// services/employeeService.js
// A service module that handles business logic (like interacting with the database) related to employees.
const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const validator = require("validator"); // For input sanitization
const DEFAULT_ROLE = "employee"; // Default role assignment

exports.registerEmployee = async (employeeData) => {
  // Sanitize and validate input data
  // Sanitizing: Uses validator to escape harmful characters (like <>, etc.) from inputs that could lead to cross-site scripting (XSS) attacks. Specifically:escape: Removes harmful characters from first_name, last_name, and phone.
  // normalizeEmail: Adjusts email to a standard format.
  // The active_status field defaults to 1 (active) if active_employee isn’t provided.

  const sanitizedData = {
    firstName: validator.escape(employeeData.employee_first_name),
    lastName: validator.escape(employeeData.employee_last_name),
    phone: validator.escape(employeeData.employee_phone),
    email: validator.normalizeEmail(employeeData.employee_email),
    password: employeeData.employee_password, // Password is hashed, so not sanitized
    // position: validator.escape(employeeData.employee_position), // Add position with sanitization
    active: employeeData.active_employee || 1, // Default status is 1 (active)
  };

  // Validation checks for required fields
  if (
    !sanitizedData.firstName ||
    !sanitizedData.lastName ||
    !sanitizedData.phone ||
    !sanitizedData.email ||
    !sanitizedData.password 
    // !sanitizedData.position // Check for position as well
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
      "INSERT INTO employees (first_name, last_name, phone, email, password, active_status, role) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      sanitizedData.firstName,
      sanitizedData.lastName,
      sanitizedData.phone,
      sanitizedData.email,
      hashedPassword,
      // sanitizedData.position, // Include position in the query
      sanitizedData.active,
      DEFAULT_ROLE,
    ];

    // Execute the query and return a promise with the result
    // Executes the SQL query using the db.query method.
    // If successful, it resolves the promise with a success message and response data, including:
    // id: The unique identifier (ID) of the newly created employee.
    // Other Employee Details: Excludes sensitive info like the hashed password but includes firstName, lastName, phone, etc.
    // If an error occurs, it rejects the promise, which will be caught in the controller and handled there.
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
              // position: sanitizedData.position, // Include position in the response data
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
