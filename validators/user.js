const { body, param } = require("express-validator");
const validate = require("./validate.js");

module.exports = {
    createValidation: [
        body("username")
            .isString().withMessage("Enter a text")
            .isLength({ min: 5 }).withMessage("Username can not be less than 5 character"),
        body("password")
            .isLength({ min: 6 }).withMessage("Password can not be less than 6 character"),
        body("full_name")
            .isLength({ min: 1 }).withMessage("Full name can not be null"),
        body("role")
            .isIn(["A", "U", "E"]).withMessage("Role must be Admin or User or Engineer"),
        body("phone")
            .isLength({ max: 11 }).withMessage("Maximum phone number digits: 11"),
        validate
    ],
    updateValidation: [
        param("user_id")
            .isInt({ min: 2 }).withMessage("UserID must be number and greater than 1"),
        body("username")
            .isString().withMessage("Enter a text")
            .isLength({ min: 5 }).withMessage("Username can not be less than 5 character"),
        body("full_name")
            .isLength({ min: 1 }).withMessage("Full name can not be null"),
        body("role")
            .isIn(["A", "U", "E"]).withMessage("Role must be Admin or User or Engineer"),
        body("phone")
            .isLength({ max: 11 }).withMessage("Maximum phone number digits: 11"),
        validate
    ],
    updatePasswordValidation: [
        param("user_id")
            .isInt({ min: 2 }).withMessage("UserID must be number and greater than 1"),
        body("password")
            .isLength({ min: 6 }).withMessage("Password can not be less than 6 character"),
        validate
    ],
    checkID: [
        param("user_id")
            .isInt({ min: 2 }).withMessage("UserID must be number and greater than 1"),
        validate
    ]
};