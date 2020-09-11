const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/addList", (req, res) => {
  db("tbl_daily_staff_list")
    .insert({
      st_id: req.body.st_id,
      work_date: req.body.work_date,
      user_id: req.body.user_id,
      location: req.body.location,
      note: req.body.note,
    })
    .then(([data]) => {
      return res.status(200).json({
        message: "List created",
        dsl_id: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/updateList/:dsl_id", (req, res) => {
  db("tbl_daily_staff_list").where("dsl_id", req.params.dsl_id).update({
    st_id: req.body.st_id,
    work_date: req.body.work_date,
    user_id: req.body.user_id,
    location: req.body.location,
    note: req.body.note,
  }).then(()=>{
      return res.status(200).json({
          message:"List Updated"
      })
  }).catch((err)=>{
      return res.status(500).json({
          message:err
      })
  })
});

router.delete('/deleteList',(req,res)=>{
    db('tbl_daily_staff_list').where('dsl_id',req.params.dsl_id).delete().then(()=>{
        return res.status(200).json({
            message:'List deleted'
        })
    }).catch((err)=>{
        return res.status(500).json({
            message:err
        })
    })
})

module.exports = router;
