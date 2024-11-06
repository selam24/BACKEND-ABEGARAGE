// middleware/validationMiddleware.js
const { body, validationResult } = require("express-validator");

// Define validation rules for employee registration
const validateEmployeeRegistration = [
  body("employee_first_name").notEmpty().withMessage("First name is required"),
  body("employee_last_name").notEmpty().withMessage("Last name is required"),
  body("employee_phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
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
