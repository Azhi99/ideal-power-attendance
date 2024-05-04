const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/", async (req, res) => {
    const [{noOfEmployees}] = await db("tbl_employees").where("active_status", "1").count("* as noOfEmployees");
    const [{noOfStaffLog}] = await db("tbl_staff_log_employee").count("* as noOfStaffLog");
    const [{noOfActiveLog}] = await db("tbl_active_log_employee").count("* as noOfActiveLog");
    const [{noOfExpired}] = await db("tbl_employees").where("expiry_passport", "<=", db.fn.now()).count("* as noOfExpired");
    const cabinas = await db("cabinas").select("*");

    
    const notifications = await db.raw(`
        SELECT
            notifications.notification_id,
            notifications.text,
            notifications.color,
            notifications.username
        FROM
            notifications
        JOIN notifications_users ON (notifications.notification_id = notifications_users.notification_id)
        WHERE
            notifications_users.user_id = ${req.body.user_id} AND notifications.show_notification = 'true'
            AND ((DATE_FORMAT(NOW(), '%Y-%m-%d') BETWEEN notifications.date_from AND notifications.date_to) OR DATE_FORMAT(NOW(), '%d') = notifications.day )
    `).then((data) => {
        return data[0];
    });

    return res.status(200).json({
        noOfEmployees,
        noOfStaffLog,
        noOfActiveLog,
        noOfExpired,
        cabinas,
        notifications
    });
});

router.post("/getStaffLogChange", (req, res) => {
    db("view_staff_log").select().offset(req.body.offset).limit(20).then((data) => {
        return res.status(200).send(data);
     }).catch((err) => {
        console.log(err);
     })
});

router.delete("/deleteStaffLog/:sle_id", (req, res) => {
    db("tbl_staff_log_employee").where("sle_id", req.params.sle_id).delete().then(() => {
        return res.status(200).json({
            message: "Staff log deleted"
        });
    });
});

router.post("/searchStaffLogChange", (req, res) => {
    db.select(
        "view_staff_log.sle_id as sle_id",
        "view_staff_log.full_name as full_name",
        "view_staff_log.old_staff as old_staff",
        "view_staff_log.new_staff as new_staff",
        "view_staff_log.change_date as change_date"
    )
      .from("view_staff_log")
      .where("sle_id", req.body.search_value)
      .orWhere("full_name", "like", ('%' + req.body.search_value + '%'))
      .orWhere("old_staff", "like", ('%' + req.body.search_value + '%'))
      .orWhere("new_staff", "like", ('%' + req.body.search_value + '%'))
      .orWhere("change_date", "like", ('%' + req.body.search_value + '%')).then((data) => {
        return res.status(200).send(data);
    });
});

router.post("/searchActiveLogChange", (req, res) => {
    db.select(
        "tbl_active_log_employee.ale_id as ale_id",
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_active_log_employee.change_type as change_type",
        "tbl_active_log_employee.change_date as change_date"
    ).from("tbl_active_log_employee")
     .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_active_log_employee.emp_id")
     .where("tbl_employees.first_name", "like", ('%' + req.body.search_value +'%'))
     .orWhere("tbl_employees.last_name", "like", ('%' + req.body.search_value +'%'))
     .orWhere("tbl_active_log_employee.change_type", "like", ('%' + req.body.search_value +'%'))
     .orWhere("tbl_active_log_employee.change_date", "like", ('%' + req.body.search_value +'%')).then((data) => {
        return res.status(200).send(data);
     });
});

router.post("/getActiveLog", (req, res) => {
    db.select(
        "tbl_active_log_employee.ale_id as ale_id",
        db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
        "tbl_active_log_employee.change_type as change_type",
        "tbl_active_log_employee.change_date as change_date",
    ).from("tbl_active_log_employee")
     .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_active_log_employee.emp_id")
     .offset(req.body.offset)
     .limit(20).then((data) => {
        return res.status(200).send(data);
     });
});

router.delete("/deleteActiveLog/:ale_id", (req, res) => {
    db("tbl_active_log_employee").where("ale_id", req.params.ale_id).delete().then(() => {
        return res.status(200).json({
            message: "Active log deleted"
        });
    });
});

module.exports = router;