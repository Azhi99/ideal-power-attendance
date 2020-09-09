const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/getData", (req, res) => {
    db("tbl_jobs").select(["job_id", "job_title"]).then((data) => {
        return res.status(200).send(data);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.post("/addJob", (req, res) => {
    db("tbl_jobs").insert({
        job_title: req.body.job_title
    }).then(([data]) => {
        return res.status(200).json({
            message: "Job Added",
            job_id: data
        });
    }).catch((err) => {
        if(err.errno === 1062){
            return res.status(500).json({
                message: "This Job title already exist"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/updateJob/:job_id", (req, res) => {
    db("tbl_jobs").where("job_id", req.params.job_id).update({
        job_title: req.body.job_title
    }).then(() => {
        return res.status(200).json({
            message: "Job Updated"
        });
    }).catch((err) => {
        if(err.errno === 1062){
            return res.status(500).json({
                message: "This Job title already exist"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});

router.delete("/deleteJob/:job_id", (req, res) => {
    db("tbl_jobs").where("job_id", req.params.job_id).delete().then(()=> {
        return res.status(200).json({
            message: "Job Deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

module.exports = router;