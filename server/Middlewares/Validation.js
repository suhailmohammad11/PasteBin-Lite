const { body } = require("express-validator");

exports.createPasteValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .escape(),

  body("ttl_seconds")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ttl_seconds must be an integer ≥ 1"),

  body("max_views")
    .optional()
    .isInt({ min: 1 })
    .withMessage("max_views must be an integer ≥ 1"),
];
