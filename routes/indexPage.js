const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/", async (req, res) => {
    const [{noOfEmployees}] = await db.raw(`
        SELECT
            COUNT(tbl_employees.emp_id) as noOfEmployees
        FROM
            tbl_employees
            JOIN tbl_staffs ON (tbl_staffs.st_id = tbl_employees.st_id)
        WHERE
            tbl_staffs.show_staff = '1'
            AND tbl_employees.active_status = '1'
    `).then(d => {
        return d[0]
    })
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
            AND ((DATE_FORMAT(NOW(), '%Y-%m-%d') BETWEEN notifications.date_from AND notifications.date_to) OR DATE_FORMAT(NOW(), '%d') = notifications.day OR (
                    notifications.days IS NOT NULL AND FIND_IN_SET(DAY(NOW()), notifications.days) > 0
                ) 
            )
        ORDER BY notifications.notification_id DESC
    `).then((data) => {
        return data[0];
    });

    const removed_staffs_from_passport_and_accomodations = await db('removed_staffs_from_passport_and_accomodations').select('')
    const removed_staff_from_passport = removed_staffs_from_passport_and_accomodations.filter(f => f.removed_from == 'passport').map(m => m.st_id)
    const removed_staff_from_accomodations = removed_staffs_from_passport_and_accomodations.filter(f => f.removed_from == 'accomodation').map(m => m.st_id)

    return res.status(200).json({
        noOfEmployees,
        noOfStaffLog,
        noOfActiveLog,
        noOfExpired,
        cabinas,
        notifications,
        removed_staff_from_passport,
        removed_staff_from_accomodations
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