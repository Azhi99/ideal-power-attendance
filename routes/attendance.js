const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addAttendance", (req, res) => {
    
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
