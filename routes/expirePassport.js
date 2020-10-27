const express = require("express");
const db = require("../DB/mainDBconfig");
const router = express.Router();

router.post("/getData", (req, res) => {
    db.select(
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_employees.expiry_passport as expire_date"
    ).from("tbl_employees")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
     .where("tbl_employees.expiry_passport", "<=", new Date().toISOString().split("T")[0])
     .then((data) => {
        return res.status(200).send(data);
     });
});

module.exports = router;