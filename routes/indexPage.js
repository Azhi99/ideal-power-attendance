const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/", async (req, res) => {
    const [{noOfEmployees}] = await db("tbl_employees").where("active_status", "1").count("* as noOfEmployees");
    return res.status(200).json({
        noOfEmployees
    });
});


module.exports = router;