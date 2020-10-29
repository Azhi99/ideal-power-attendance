const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addAttendance", (req, res) => {
    db("tbl_attendance").insert({
        dsl_id: req.body.dsl_id,
        emp_id: req.body.emp_id,
        over_time: 0,
        worked_hours: 8,
        fine: 0,
        fine_reason: req.body.fine_reason,
        absent: "0"
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

router.post("/addOtherEmployee", (req, res) => {
    db.raw(
      "select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?) and emp_id = ?",
      [req.body.work_date, req.body.emp_id]
    ).then(([data]) => {
        if(data.length != 0){
            return res.status(500).json({
                message: "This employee has in another staff for this day"
            });
        } else {
            db("tbl_attendance").insert({
                dsl_id: req.body.dsl_id,
                emp_id: req.body.emp_id,
                overtime: 0,
                worked_hours: 8,
                fine: 0,
                fine_reason: null,
                absent: "0",
                location: req.body.location
            }).then(([data]) => {
                return res.status(200).json({
                    message: "Attendance Added",
                    at_id: data
                });
            });
        }
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
                    return res.status(200).json({
                        message: "List changed"
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

router.patch("/returnEmployee/:at_id/:st_id", (req, res) => {
    db("tbl_daily_staff_list").where("st_id", req.params.st_id).andWhere("work_date", req.body.work_date).select([
        "dsl_id",
        "location"
    ]).limit(1).then(([{dsl_id, location}]) => {
        db("tbl_attendance").where("at_id", req.params.at_id).update({
            dsl_id,
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
