const express = require("express");
const db = require("../DB/mainDBconfig");
const db_user = require("../DB/userDBconfig");
const router = express.Router();

router.post("/addEngineer", (req, res) => {
  db("tbl_engineers")
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      job_id: req.body.job_id,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      reg_date: db.fn.now(),
      active_status: "1"
    })
    .then(([data]) => {
      return res.status(200).json({
        message: "Enginner Added",
        en_id: data,
      });
    })
    .catch((err) => {
      if(err.errno == 1062){
        return res.status(500).json({
          message: "One of the phone numbers already exist"
        });
      }
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
      phone2: req.body.phone2
    })
    .then(() => {
      db_user("tbl_users")
        .where("en_id", req.params.en_id)
        .update({
          username: req.body.phone1,
          full_name: req.body.first_name + " " + req.body.last_name,
          phone: req.body.phone1,
        })
        .then(() => {
          return res.status(200).json({
            message: "Updated",
          });
        });
    })
    .catch((err) => {
      if(err.errno == 1062){
        return res.status(500).json({
          message: "One of the phone numbers already exist"
        });
      }
      return res.status(500).json({
        message: err
      });
    });
});

router.delete("/deleteEngineer/:en_id", (req, res) => {
  db("tbl_engineers")
    .where("en_id", req.params.en_id)
    .delete()
    .then(() => {
      db_user("tbl_users")
        .where("en_id", req.params.en_id)
        .delete()
        .then(() => {
          return res.status(200).json({
            message: "Engineer deleted",
          });
        });
    })
    .catch((err) => {
      if(err.errno === 1451){
        return res.status(500).json({
          message: "Can not delete this engineer, it used in employees and staff lists"
        });
      }
      return res.status(500).json({
        message: err
      });
    });
});

router.post("/getData", (req, res) => {
  db.select(
    "tbl_engineers.en_id as en_id",
    "tbl_engineers.first_name as first_name",
    "tbl_engineers.last_name as last_name",
    "tbl_jobs.job_title as job_title",
    "tbl_engineers.phone1 as phone1",
    "tbl_engineers.phone2 as phone2",
    "tbl_engineers.reg_date as reg_date",
    "tbl_engineers.active_status as active_status"
  ).from("tbl_engineers")
   .join("tbl_jobs", "tbl_jobs.job_id", "=", "tbl_engineers.job_id")
   .where("tbl_engineers.active_status", "1").then((data) => {
     return res.status(200).send(data);
   });
});

router.post("/getEngineerReport", (req, res) => {
  db.select(
    "tbl_engineers.en_id as en_id",
    "tbl_engineers.first_name as first_name",
    "tbl_engineers.last_name as last_name",
    "tbl_jobs.job_title as job_title",
    "tbl_engineers.phone1 as phone1",
    "tbl_engineers.phone2 as phone2",
    "tbl_engineers.reg_date as reg_date",
    "tbl_engineers.active_status as active_status"
  ).from("tbl_engineers")
   .join("tbl_jobs", "tbl_jobs.job_id", "=", "tbl_engineers.job_id").then((data) => {
     return res.status(200).send(data);
   });
});

router.post("/getDeactived", (req, res) => {
  db.select(
    "tbl_engineers.en_id as en_id",
    "tbl_engineers.first_name as first_name",
    "tbl_engineers.last_name as last_name",
    "tbl_jobs.job_title as job_title",
    "tbl_engineers.phone1 as phone1",
    "tbl_engineers.phone2 as phone2",
    "tbl_engineers.reg_date as reg_date",
    "tbl_engineers.active_status as active_status"
  ).from("tbl_engineers")
   .join("tbl_jobs", "tbl_jobs.job_id", "=", "tbl_engineers.job_id")
   .where("tbl_engineers.active_status", "0").then((data) => {
     return res.status(200).send(data);
   });
});

router.post("/getActived", (req, res) => {
  db.select(
    "tbl_engineers.en_id as en_id",
    "tbl_engineers.first_name as first_name",
    "tbl_engineers.last_name as last_name",
    "tbl_jobs.job_title as job_title",
    "tbl_engineers.phone1 as phone1",
    "tbl_engineers.phone2 as phone2",
    "tbl_engineers.reg_date as reg_date",
    "tbl_engineers.active_status as active_status"
  ).from("tbl_engineers")
   .join("tbl_jobs", "tbl_jobs.job_id", "=", "tbl_engineers.job_id")
   .where("tbl_engineers.active_status", "1").then((data) => {
     return res.status(200).send(data);
   });
});

router.post("/getNames", (req, res) => {
  db("tbl_engineers")
    .where("active_status", "1")
    .select(["en_id", db.raw("concat(first_name, ' ', last_name) as full_name")])
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/deactiveEngineer/:en_id", (req, res) => {
  db("tbl_staffs").where("en_id", req.params.en_id).count("* as staffs").then(([{staffs}]) => {
    if(staffs > 0){
      return res.status(500).json({
        message: "Change staffs engineer before deactive"
      });
    } else {
      db("tbl_engineers").where("en_id", req.params.en_id).update({
        active_status: "0"
      }).then(() => {
        db_user("tbl_users").where("en_id", req.params.en_id).update({
          active_status: "0"
        }).then(() => {
          return res.status(200).json({
            message: "Engineer Deactived"
          });
        });
      }).catch((err) => {
        return res.status(500).json({
          message: err
        });
      });
    }
  });
});

router.patch("/activeEngineer/:en_id", (req, res) => {
  db("tbl_engineers").where("en_id", req.params.en_id).update({
    active_status: "1"
  }).then(() => {
    db_user("tbl_users").where("en_id", req.params.en_id).update({
      active_status: "1"
    }).then(() => {
      return res.status(200).json({
        message: "Engineer Actived"
      });
    });
  }).catch((err) => {
    return res.status(500).json({
      message: err
    });
  });
});

module.exports = router;
