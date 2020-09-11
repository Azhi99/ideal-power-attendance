const express = require("express");
const db = require("../DB/mainDBconfig");
const router = express.Router();

router.post("/addEngineer", (req, res) => {
  db("tbl_engineers")
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      job_id: req.body.job_id,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      reg_date: req.body.reg_data,
      active_status: req.body.active_status,
    })
    .then(([data]) => {
      return res.status(200).json({
        message: "Enginner Added",
        en_id: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/updateEngineer/:en_id", (req, res) => {
  db("tbl_engineers")
    .where("en_id", req.params.en_id)
    .update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      job_id: req.body.job_id,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      reg_date: req.body.reg_data,
      active_status: req.body.active_status,
    })
    .then(() => {
      return res.status(200).json({
        message: "Updated",
      });
    })
    .catch((err) => {
      message: err;
    });
});

router.delete("/deleteEngineer/:en_id", (req, res) => {
  db("tbl_engineers")
    .where("en_id", req.params.en_id)
    .delete()
    .then(() => {
      return res.status(200).json({
        message: "Engineer deleted",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getData", (req, res) => {
  db("tbl_engineers")
    .select("*")
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
