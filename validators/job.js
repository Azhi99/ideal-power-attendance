const { body, param } = require("express-validator");
const validate = require("./validate.js");

module.exports = {
    checkJobTitle: [
        body("job_title")
            .isString().withMessage("Enter a text")
            .isLength({ min: 1 }).withMessage("Job title can not be null"),
        validate
    ],
    checkID: [
        param("job_id")
            .isInt({ gt: 0 }).withMessage("Job ID must be number and greater than 0"),
        validate
    ]
};