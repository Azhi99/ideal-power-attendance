const express = require("express");
const bcrypt = require("bcrypt");
const user_db = require("../DB/userDBconfig.js");
const db = require("../DB/mainDBconfig.js");
const { createValidation, updateValidation, updatePasswordValidation, checkID } = require("../validators/user.js");

const router = express.Router();

router.post("/getData", (req, res) => {
    user_db("tbl_users").where("user_id", "<>", "1").select([
        "user_id",
        "username",
        "full_name",
        "role",
        "phone",
        "active_status"
    ]).orderBy('user_id', 'desc').then((data) => {
        return res.status(200).send(data);
    });
});

router.post("/addUser", createValidation, (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user_db("tbl_users").insert({
            username: req.body.username,
            password: hash,
            en_id: req.body.en_id || null,
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

router.post('/getActived', (req, res) => {
    user_db("tbl_users").where("active_status", "1").andWhere('user_id', '<>', '1').select([
        "user_id",
        "full_name",
    ]).orderBy('user_id', 'desc').then((data) => {
        return res.status(200).send(data);
    });
})

router.post('/getSelf/:user_id', (req, res) => {
    user_db("tbl_users").whereIn('user_id', [req.params.user_id, 55]).andWhere("active_status", "1").select([
        "user_id",
        "full_name",
    ]).orderBy('user_id', 'desc').then((data) => {
        return res.status(200).send(data);
    });
})

router.patch("/updateUser/:user_id", updateValidation, async (req, res) => {
    const [{ noOfAdmins }] = await user_db("tbl_users")
                                    .where("user_id", "<>", "1")
                                    .andWhere("role", "A")
                                    .count("* as noOfAdmins");
    const [{ role, en_id }] = await user_db("tbl_users")
                            .where("user_id", req.params.user_id)
                            .select(["role as role", "en_id as en_id"])
                            .limit(1);
    if(noOfAdmins == 1 && role == "A" && ["U", "E"].includes(req.body.role)){
        return res.status(500).json({
            message: "Can not change role for this user"
        });
    } else {
        if(role == 'E'){
            db("tbl_engineers").where("en_id", en_id).update({
                first_name: req.body.full_name.split(" ")[0],
                last_name: req.body.full_name.split(" ")[1],
                phone1: req.body.username
            }).then(() => {});
        }
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
    }
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

router.patch("/deactiveUser/:user_id", checkID, async (req, res) => {
    const [{ noOfAdmins }] = await user_db("tbl_users")
                                    .where("user_id", "<>", "1")
                                    .andWhere("role", "A")
                                    .andWhere("active_status", "1")
                                    .count("* as noOfAdmins");
    const [{ role }] = await user_db("tbl_users")
                            .where("user_id", req.params.user_id)
                            .select(["role as role"])
                            .limit(1);
    if(noOfAdmins == 1 && role == "A"){
        return res.status(500).json({
            message: "Can not deactive this user"
        });
    } else {
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
    }
});

router.delete("/deleteUser/:user_id", checkID, async (req, res) => {
    const [{ noOfAdmins }] = await user_db("tbl_users")
                                    .where("user_id", "<>", "1")
                                    .andWhere("role", "A")
                                    .count("* as noOfAdmins");
    const [{ role }] = await user_db("tbl_users")
                            .where("user_id", req.params.user_id)
                            .select(["role as role"])
                            .limit(1);

    if(noOfAdmins == 1 && role == "A"){
        return res.status(500).json({
            message: "Can not delete this user"
        });
    } else {
        user_db("tbl_users").where("user_id", req.params.user_id).delete().then(() => {
            return res.status(200).json({
                message: "User Deleted"
            });
        }).catch((err) => {
            return res.status(500).json({
                message: err
            });
        });
    }
});

module.exports = router;