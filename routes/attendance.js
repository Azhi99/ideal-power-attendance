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
        absent: "1"
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

router.patch("/setAbsent/:at_id", (req, res) => {
    db("tbl_attendace").where("at_id", req.params.at_id).update({
        absent: "0",
        worked_hours: 0
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
    db("tbl_attendace").where("at_id", req.params.at_id).update({
        absent: "1",
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


router.patch('/updateAttendance/:at_id',(req,res)=>{
    db('tbl_attendance').where('at_id',req.params.at_id).update({
        overtime:req.body.overtime,
        worked_hours:req.body.worked_hours,
        fine:req.body.fine,
        fine_reason:req.body.fine_reason
    }).then(()=>{
        return res.status(200).json({
            message:'Update'
        })
    }).catch((err)=>{
        return res.status(500).json({
            message:err
        })
    })
})

module.exports = router;
