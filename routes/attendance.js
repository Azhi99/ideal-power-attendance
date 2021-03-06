const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addAttendance", (req, res) => {
    db("tbl_attendance").insert({
        dsl_id: req.body.dsl_id,
        emp_id: req.body.emp_id,
        overtime: 0,
        worked_hours: 8,
        fine: 0,
        fine_reason: null,
        absent: "0",
        location: req.body.location,
        st_id: req.body.st_id,
        old_st_id: req.body.st_id
    }).then(([data]) => {
        return res.status(200).json({
            message: "Attendance Added",
            at_id: data
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.post("/getMissedEmployees", (req, res) => {
    db("tbl_employees")
      .where("st_id", req.body.st_id)
      .andWhere("active_status", "1")
      .andWhereRaw("emp_id not in (select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?))", [req.body.work_date])
      .select([
        "emp_id",
        db.raw("concat(first_name, ' ', last_name) as full_name"),
        "salary_type"
      ])
      .then((data) => {
        return res.status(200).send(data);
      });
});

router.patch("/setAbsent/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "1",
        worked_hours: 0,
        overtime: 0
    }).then(() => {
        return res.status(200).json({
            message: "Absented"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/cancelAbsent/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "0",
        worked_hours: 8
    }).then(() => {
        return res.status(200).json({
            message: "Absent canceled"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/setOff/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "2",
        worked_hours: 0,
        overtime: 0
    }).then(() => {
        return res.status(200).json({
            message: "Setted to Off"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});




router.patch('/updateAttendance/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).update({
        fine:req.body.fine,
        fine_reason:req.body.fine_reason
    }).then(()=>{
        return res.status(200).json({
            message:'Update'
        });
    }).catch((err)=>{
        return res.status(500).json({
            message:err
        });
    });
});

router.patch('/setWorkedHours/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).update({
        worked_hours: req.body.worked_hours
    }).then(()=>{
        return res.status(200).json({
            message: 'Update'
        });
    }).catch((err)=>{
        return res.status(500).json({
            message: err
        });
    });
});

router.patch('/setOvertime/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).update({
        overtime: req.body.overtime
    }).then(()=>{
        return res.status(200).json({
            message: 'Update'
        });
    }).catch((err)=>{
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/setLocation/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        location: req.body.location
    }).then(() => {
        return res.status(200).json({
            message: "Updated"
        });
    });
});

router.patch("/updateAttendancesLocation", (req, res) => {
    db("tbl_attendance").whereIn("at_id", req.body.emps).update({
        location: req.body.location
    }).then(() => {
        return res.status(200).json({
            message: "Updated"
        });
    });
});

router.patch("/changeStaff/:at_id/:st_id/:work_date/:old_st_id", (req, res) => {
    db("tbl_daily_staff_list").where("st_id", req.params.st_id).andWhere("work_date", req.params.work_date).select(["dsl_id as dsl_id"]).then(([dsl_id]) => {
        if(typeof dsl_id != "undefined"){
            dsl_id = dsl_id.dsl_id;
            db("tbl_daily_staff_list").where("dsl_id", dsl_id).select(["location"]).limit(1).then(([{location}]) => {
                db("tbl_attendance").where("at_id", req.params.at_id).update({
                    dsl_id: dsl_id,
                    location: location.split(",")[0]
                }).then(() => {
                    db("tbl_attendance").where("at_id", req.params.at_id).update({
                        st_id: req.params.st_id
                    }).then(() => {
                        return res.status(200).json({
                            message: "List changed"
                        });
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        message: err
                    });
                });
            });
        } else {
            db("tbl_temp_attendance").insert({
                st_id: req.params.st_id,
                old_st_id: req.params.old_st_id,
                emp_id: req.body.emp_id,
                overtime: req.body.overtime,
                worked_hours: req.body.worked_hours,
                fine: req.body.fine,
                fine_reason: req.body.fine_reason,
                absent: req.body.absent,
                work_date: req.body.work_date
            }).then(() => {
                db("tbl_attendance").where("at_id", req.params.at_id).delete().then(() => {
                    return res.status(200).json({
                        message: "List changed"
                    });
                });
            });
        }
    });
});

router.get("/getTransferedEmployees/:year/:month/:old_st_id", (req, res) => {
    db.select(
        "tbl_temp_attendance.t_at_id as t_at_id",
        db.raw("CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as employee"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_temp_attendance.work_date as work_date"
    ).from("tbl_temp_attendance")
     .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_temp_attendance.emp_id")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_temp_attendance.st_id")
     .whereRaw("YEAR(tbl_temp_attendance.work_date) = ?", [req.params.year])
     .andWhereRaw("MONTH(tbl_temp_attendance.work_date) = ?", [req.params.month])
     .andWhere("tbl_temp_attendance.old_st_id", req.params.old_st_id)
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.patch("/returnEmployee/:at_id/:st_id", (req, res) => {
    db("tbl_daily_staff_list").where("st_id", req.params.st_id).andWhere("work_date", req.body.work_date).select([
        "dsl_id",
        "location"
    ]).limit(1).then(([{dsl_id, location}]) => {
        db("tbl_attendance").where("at_id", req.params.at_id).update({
            dsl_id,
            st_id: req.params.st_id,
            location: location.split(",")[0]
        }).then(() => {
            return res.status(200).json({
                message: "Employee Returned"
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: err
            });
        });
    });
});

router.delete("/deleteAttendance/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).delete().then(() => {
        return res.status(200).json({
            message: "Attendance deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

module.exports = router;
