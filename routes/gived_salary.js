const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addGiveSalary", (req, res) => {
    db("tbl_gived_salary").insert({
        emp_id: req.body.emp_id,
        salary_month: req.body.salary_month,
        salary_year: req.body.salary_year,
        monthly_salary: req.body.monthly_salary,
        daily_salary: req.body.daily_salary,
        hour_salary: req.body.hour_salary,
        dollar_price: req.body.dollar_price,
        gived_salary: req.body.gived_salary,
        gived_date: db.fn.now(),
        gived_status: "1"
    }).then(() => {
        return res.status(200).json({
            message: "Salary Gived"
        });
    }).catch((err) => {
        if(err.errno == 1062){
            return res.status(500).json({
                message: "This Employee has gived salary"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});

router.post("/employeeInfo/:month/:year/:phone", (req, res) => {
    db.select(
        "tbl_gived_salary.gs_id"
    )
    .from("tbl_gived_salary")
    .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_gived_salary.emp_id")
    .where("tbl_gived_salary.salary_month", req.params.month)
    .andWhere("tbl_gived_salary.salary_year", req.params.year)
    .andWhere("tbl_employees.phone", req.params.phone)
    .then((data) => {
        if(data.length == 0){
            return res.status(500).json({
                message: "Data Not found"
            });
        }
        return res.status(200).json({
            message: "Data Found"
        });
    });
});

router.post("/getGivedSalary/:month/:year", (req, res) => {
    db("employee_final_with_give_salary")
        .where("date_to_m", req.params.month)
        .andWhere("date_to_y", req.params.year)
        .andWhere("gived_status", "1").select([
            "emp_id",
            "full_name",
            "staff_name",
            "salary_type",
            "total_o_s as total_overtime",
            "total_fine",
            "gived_salary",
            "gived_date"
    ]).then((data) => {
        return res.status(200).send(data);
    });
});

module.exports = router;