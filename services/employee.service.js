// services/employeeService.js
const db = require("../config/db.config");
const bcrypt = require("bcrypt");

const DEFAULT_ROLE = "employee"; // Default role assignment

exports.registerEmployee = async (employeeData) => {
  // Validation of email and other business logic happens here, not in the controller.
  const { first_name, last_name, phone, email, password, active_status, role } =
    employeeData;

  try {
    // Check if email is already registered
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM employees WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      throw new Error("Email already registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new employee into the database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO employees (first_name, last_name, phone, email, password, active_status, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          first_name,
          last_name,
          phone,
          email,
          hashedPassword,
          active_status || 1,
          role || DEFAULT_ROLE,
        ]
      );

    return {
      insertId: result.insertId, // Return the ID of the newly created employee
    };
  } catch (error) {
    throw new Error("Failed to register employee: " + error.message);
  }
};
