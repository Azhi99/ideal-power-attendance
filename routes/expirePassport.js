const express = require("express");
const db = require("../DB/mainDBconfig");
const router = express.Router();

router.post("/getData", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.st_id as st_id",
        "tbl_employees.country as country",
        "tbl_employees.phone as phone",
        "tbl_employees.active_status as active_status",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .whereRaw(`tbl_employees.expiry_passport IS NOT NULL`)
     .andWhereRaw(`tbl_employees.country <> '1'`)
     .andWhereRaw(`tbl_employees.expiry_passport <= NOW() + INTERVAL 60 DAY`)
     .orderBy("tbl_employees.expiry_passport", "asc")
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.post("/getSixMonthData", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.st_id as st_id",
        "tbl_employees.country as country",
        "tbl_employees.phone as phone",
        "tbl_employees.active_status as active_status",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .whereRaw(`tbl_employees.expiry_passport IS NOT NULL`)
     .andWhereRaw(`tbl_employees.country <> '1'`)
     .andWhereRaw(`tbl_employees.expiry_passport <= NOW() + INTERVAL 6 MONTH`)
     .orderBy("tbl_employees.expiry_passport", "asc")
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.post("/getOneYearData", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.st_id as st_id",
        "tbl_employees.country as country",
        "tbl_employees.phone as phone",
        "tbl_employees.active_status as active_status",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .whereRaw(`tbl_employees.expiry_passport IS NOT NULL`)
     .andWhereRaw(`tbl_employees.country <> '1'`)
     .andWhereRaw(`tbl_employees.expiry_passport <= NOW() + INTERVAL 1 YEAR`)
     .orderBy("tbl_employees.expiry_passport", "asc")
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.post("/getOneAndHalfYearData", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.st_id as st_id",
        "tbl_employees.country as country",
        "tbl_employees.phone as phone",
        "tbl_employees.active_status as active_status",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .whereRaw(`tbl_employees.expiry_passport IS NOT NULL`)
     .andWhereRaw(`tbl_employees.country <> '1'`)
     .andWhereRaw(`tbl_employees.expiry_passport <= NOW() + INTERVAL 1 YEAR + INTERVAL 6 MONTH`)
     .orderBy("tbl_employees.expiry_passport", "asc")
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.post("/getAll", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.st_id as st_id",
        "tbl_employees.country as country",
        "tbl_employees.phone as phone",
        "tbl_employees.active_status as active_status",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .whereRaw(`tbl_employees.expiry_passport IS NOT NULL`)
     .andWhereRaw(`tbl_employees.country <> '1'`)
     .andWhereRaw(`STR_TO_DATE(tbl_employees.expiry_passport, '%Y-%m-%d') IS NOT NULL`)
     .orderBy("tbl_employees.expiry_passport", "asc")
     .then((data) => {
        return res.status(200).send(data);
     });
})

module.exports = router;