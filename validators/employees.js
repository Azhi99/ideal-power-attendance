const { body, param } = require("express-validator");
const validate = require("./validate.js");

module.exports = {
    createValidation: [

    ],
    updateValidation: [
        param("emp_id")
            .isInt({ min: 1 }).withMessage("Employee ID must be number and greater than 0"),
        body("first_name")
            .isLength({ min: 1 }).withMessage("Enter first name"),  
        body("last_name")
            .isLength({ min: 1 }).withMessage("Enter first name"), 
        body("st_id")
            .isInt({ min: 1 }).withMessage("Staff ID must be number and greater than 0"), 
        body("phone")
            .isLength({ min: 11, max: 11 }).withMessage("Phone number must be 11 digit"), 
        body("salary_type")
            .isIn(["Monthly", "Daily"]).withMessage("Salary type must be monthly or daily"), 
        validate
    ],
    checkID: [
        param("emp_id")
            .isInt({ min: 1 }).withMessage("Employee ID must be number and greater than 0"),
        validate
    ]
};