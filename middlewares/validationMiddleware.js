// middleware/validationMiddleware.js
// body: Used to specify validation rules for individual fields in the request body.
// validationResult: Collects and checks the results of the validation to see if any rules were violated.
const { body, validationResult } = require("express-validator");

// Define validation rules for employee registration
// employee_first_name and employee_last_name: Checks that these fields are not empty.
// employee_phone: Validates that the phone number is provided and is in a valid mobile phone format.
// employee_email: Ensures that the email is in a correct email format.
// employee_password: Requires the password to be at least 6 characters long.
// active_employee: Optional field; if present, it must be an integer with a value of either 0 or 1.

const validateEmployeeRegistration = [
  body("employee_first_name").notEmpty().withMessage("First name is required"),
  body("employee_last_name").notEmpty().withMessage("Last name is required"),
  body("employee_phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/) // Allows formats like 123-456-7890 or (123) 456-7890
    .withMessage("Please enter a valid phone number"),

  body("employee_email").isEmail().withMessage("Please enter a valid email"),
  body("employee_password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("active_employee")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("Active status must be 0 or 1"),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateEmployeeRegistration };
