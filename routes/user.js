const express = require("express");
const bcrypt = require("bcrypt");
const user_db = require("../DB/userDBconfig.js");
const { createValidation, updateValidation, updatePasswordValidation, checkID } = require("../validators/user.js");

const router = express.Router();

router.post("/addUser", createValidation, (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user_db("tbl_users").insert({
            username: req.body.username,
            password: hash,
            full_name: req.body.full_name,
            role: req.body.role,
            phone: req.body.phone,
            active_status: "1"
        }).then(([data]) => {
            return res.status(200).json({
                message: "User Added",
                user_id: data
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

router.patch("/updateUser/:user_id", updateValidation, (req, res) => {
    user_db("tbl_users").where("user_id", req.params.user_id).update({
        username: req.body.username,
        full_name: req.body.full_name,
        role: req.body.role,
        phone: req.body.phone
    }).then(() => {
        return res.status(200).json({
            message: "User Updated"
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

router.patch("/updatePassword/:user_id", updatePasswordValidation, (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user_db("tbl_users").where("user_id", req.params.user_id).update({
            password: hash
        }).then(() => {
            return res.status(200).json({
                message: "Password Updated"
            });
        }).catch((err) => {
            return res.status(500).json({
                message: err
            });
        });
    });
});

router.patch("/activeUser/:user_id", checkID, (req, res) => {
    user_db("tbl_users").where("user_id", req.params.user_id).update({
        active_status: "1"
    }).then(() => {
        return res.status(200).json({
            message: "User Actived"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/deactiveUser/:user_id", checkID, (req, res) => {
    user_db("tbl_users").where("user_id", req.params.user_id).update({
        active_status: "0"
    }).then(() => {
        return res.status(200).json({
            message: "User Deactived"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.delete("/deleteUser/:user_id", checkID, (req, res) => {
    user_db("tbl_users").where("user_id", req.params.user_id).delete().then(() => {
        return res.status(200).json({
            message: "User Deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

module.exports = router;