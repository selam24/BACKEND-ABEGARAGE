// controllers/employeeController.js
// to handle the logic for registering a new employee in the system
const employeeService = require("../services/employee.service"); // Import the employee service to handle business logic
const validator = require("validator"); // Import validator for input sanitization

// Define the registerEmployee function as an async function
exports.registerEmployee = async (req, res) => {
  const {
    employee_first_name,
    employee_last_name,
    employee_phone,
    employee_email,
    employee_password,
    active_employee,
    // Uncomment below if position and role are needed in future
    // employee_position,
    employee_role,
  } = req.body;

  // Input sanitization
  // Sanitize and validate input data
  // Sanitizing: Uses validator to escape harmful characters (like <>, etc.) from inputs that could lead to cross-site scripting (XSS) attacks. Specifically:escape: Removes harmful characters from first_name, last_name, and phone.
  // normalizeEmail: Adjusts email to a standard format.
  // The active_status field defaults to 1 (active) if active_employee isn’t provided.
  const sanitizedData = {
    first_name: validator.escape(employee_first_name),
    last_name: validator.escape(employee_last_name),
    phone: validator.escape(employee_phone),
    email: validator.normalizeEmail(employee_email),
    password: employee_password, // Password will be hashed in the service, so no need to sanitize here
    active_status: active_employee !== undefined ? active_employee : 1, // Default to active (1) if not provided
    // Uncomment below if position and role are needed in future
    // position: employee_position,
    role: employee_role,
  };

  // Validation: Ensure all required fields are provided
  if (
    !sanitizedData.first_name ||
    !sanitizedData.last_name ||
    !sanitizedData.phone ||
    !sanitizedData.email ||
    !sanitizedData.password ||
    // Uncomment below if position and role are required
    // !sanitizedData.position ||
    !sanitizedData.role
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Call the service to register the employee
    // employeeService.registerEmployee: This function in employeeService handles the actual database operations, such as saving the employee’s data.
    const result = await employeeService.registerEmployee(sanitizedData);

    // Prepare response data (excluding sensitive info like password)
    // Response Data: Once the service successfully registers the employee, the code creates a responseData object with essential information (but omits the password for security).
    // Assumes the service function returns an object with an insertId, representing the employee’s new database ID.
    const responseData = {
      id: result.insertId, // Assuming 'insertId' contains the new employee's ID from MySQL
      first_name: sanitizedData.first_name,
      last_name: sanitizedData.last_name,
      phone: sanitizedData.phone,
      email: sanitizedData.email,
      active_status: sanitizedData.active_status, // Include active status in response
      // Uncomment below if position and role are needed in future
      // position: sanitizedData.position,
      role: "employee", // Assuming a default role of 'employee' is assigned
    };

    res.status(201).json({
      message: "Employee created successfully",
      success: true, // Changed to boolean for consistency
      data: responseData,
    });
  } catch (error) {
    // Handle specific error for duplicate email
    if (error.message === "Email already registered") {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already registered",
      });
    }

    // Log the error for debugging, if necessary
    console.error("Error registering employee:", error);

    // Send a general server error response
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
