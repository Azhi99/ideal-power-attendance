const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/addStaff", (req, res) => {
  db("tbl_staffs")
    .insert({
      en_id: req.body.en_id,
      staff_name: req.body.staff_name,
    })
    .then(([data]) => {
      return res.status(200).json({
        message: "Staff Added",
        st_id: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/updateStaff/:st_id", (req, res) => {
  db("tbl_staffs")
    .where("st_id", req.params.st_id)
    .update({
      en_id: req.body.en_id,
      staff_name: req.body.staff_name,
    })
    .then(() => {
      return res.status(200).json({
        message: "Staff Updated",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.delete("/deleteStaff/:st_id", (req, res) => {
  db("tbl_staffs")
    .where("st_id", req.params.st_id)
    .delete()
    .then(() => {
      return res.status(200).json({
        message: "Staff deleted",
      });
    })
    .catch((err) => {
      if(err.errno === 1451){
        return res.status(500).json({
          message: "Cannot delete this staff, it used to employees"
        });
      }
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getData", (req, res) => {
  db("tbl_staffs")
    .select()
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

module.exports = router;
