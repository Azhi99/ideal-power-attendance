const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/getData", (req, res) => {
    db("projects").select([
        "project_id",
        "project_name"
    ]).orderBy('project_id', 'desc').then((data) => {
        return res.status(200).send(data);
    });
});

router.post("/addProject", (req, res) => {
    db("projects").insert({
        project_name: req.body.project_name
    }).then(([data]) => {
        return res.status(200).json({
            message: "Project Added",
            project_id: data
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.post("/getProject", (req, res) => {
    db("projects").where("project_id", req.body.project_id).select([
        "project_id",
        "project_name"
    ]).then((data) => {
        return res.status(200).send(data);
    });
});

router.post("/updateProject", (req, res) => {
    db("projects").where("project_id", req.body.project_id).update({
        project_name: req.body.project_name
    }).then(() => {
        return res.status(200).json({
            message: "Project Updated"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.delete("/deleteProject/:project_id", (req, res) => {
    db("projects").where("project_id", req.params.project_id).del().then(() => {
        return res.status(200).json({
            message: "Project Deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

module.exports = router;