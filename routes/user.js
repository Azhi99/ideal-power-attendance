const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../DB/mainDBconfig.js");
const user_db = require("../DB/userDBconfig.js");

const router = express.Router();

router.post("/addUser", (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user_db("tbl_users").insert({
            username: req.body.username,
            password: hash,
            full_name: req.body.full_name,
            role: req.body.role,
            phone: req.body.phone,
            active_status: "1"
        }).then(([data]) => {
            db("tbl_users").insert({
                username: req.body.username,
                full_name: req.body.full_name,
                role: req.body.role,
                phone: req.body.phone,
                active_status: "1"
            }).then(() => {
                return res.status(200).json({
                    message: "User Added",
                    user_id: data
                });
            }).catch((err) => {
                user_db("tbl_users").where("user_id", data).delete().then(() => {
                    return res.status(500).json({
                        message: err
                    });
                });
            });
        }).catch((err) => {
            if(err.errno === 1062){
                return res.status(500).json({
                    message: "This user already exist, change username or full name"
                });
            }
            return res.status(500).json({
                message: err
            });
        });
    });
});




module.exports = router;