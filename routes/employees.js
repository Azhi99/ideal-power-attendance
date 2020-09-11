const express = require("express");
const db = require("../DB/mainDBconfig.js");
const { createValidation, updateValidation, checkID } = require("../validators/employees.js");

const router = express.Router();

// router to add employee and upload images


/* 
    First select staff id of the employee as old staff id
    if old staff id != new staff id, log the change and get the change id
    finally update the employee information, if err occur during the update then delete the log if it's logged
*/ 
router.patch("/updateEmployee/:emp_id", updateValidation, (req, res) => {
    var sle_id = null;
    db("tbl_employees").where("emp_id", req.params.emp_id).select(["st_id as old_st_id"]).then(async ([{old_st_id}]) => {
        if(req.body.st_id != old_st_id){
            [sle_id] = await db("tbl_staff_log_employee").insert({
                emp_id: req.params.emp_id,
                old_staff_id: old_st_id,
                new_staff_id: req.body.st_id,
                change_date: db.fn.now()
            });
        }
    }).finally(() => {
        db("tbl_employees").where("emp_id", req.params.emp_id).update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            st_id: req.body.st_id,
            phone: req.body.phone,
            birth_date: req.body.birth_date,
            salary_type: req.body.salary_type,
            monthly_salary: req.body.monthly_salary,
            daily_salary: req.body.daily_salary,
            hour_salary: req.body.hour_salary
        }).then(() => {
            return res.status(200).json({
                message: "Employee Updated"
            });
        }).catch((err) => {
            if(sle_id != null){
                db("tbl_staff_log_employee").where("sle_id", sle_id).delete().then(() => {});
            }
            if(err.errno === 1062){
                return res.status(500).json({
                    message: "The phone number already exist, please change it"
                });
            }
            return res.status(500).json({
                message: err
            });
        });
    });
});

router.patch("/updateIdentificationImage/:emp_id", checkID, (req, res) => {
    
});

router.patch("/updatePersonalImage/:emp_id", checkID, (req, res) => {

});

router.patch("/deactiveEmployee/:emp_id", checkID, (req, res) => {
    db("tbl_employees").where("emp_id", req.params.emp_id).update({
        active_status: "0"
    }).then(() => {
        return res.status(200).json({
            message: "Employee Deactived"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});


router.patch("/activeEmployee/:emp_id", checkID, (req, res) => {
    db("tbl_employees").where("emp_id", req.params.emp_id).update({
        active_status: "1"
    }).then(() => {
        return res.status(200).json({
            message: "Employee Actived"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});



module.exports = router;