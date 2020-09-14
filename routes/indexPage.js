const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/", async (req, res) => {
    const [{noOfEmployees}] = await db("tbl_employees").where("active_status", "1").count("* as noOfEmployees");
    const [{noOfEngineers}] = await db("tbl_engineers").where("active_status", "1").count("* as noOfEngineers");
    const [{noOfStaffs}] = await db("tbl_staffs").count("* as noOfStaffs");
    return res.status(200).json({
        noOfEmployees,
        noOfEngineers,
        noOfStaffs
    });
});


module.exports = router;