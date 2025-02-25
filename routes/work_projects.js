const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/getData", (req, res) => {
    db("work_projects").select("*").then((data) => {
        return res.status(200).send(data);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})

router.post('/report', async (req, res) => {
    let query = ''

    if(req.body.project_id) {
        query += ` AND tbl_attendance.work_project_id = ${req.body.project_id}`
    }

    if(req.body.emp_id) {
        query += ` AND tbl_attendance.employee_id = ${req.body.emp_id}`
    }

    if(req.body.st_id) {
        query += ` AND tbl_attendance.st_id = ${req.body.st_id}`
    }

    if(req.body.month) {
        query += ` AND MONTH(tbl_daily_staff_list.work_date) = ${req.body.month}`
    }

    if(req.body.year) {
        query += ` AND YEAR(tbl_daily_staff_list.work_date) = ${req.body.year}`
    }

    const rows = await db.raw(`
        SELECT 
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS employee_full_name,  
            tbl_attendance.st_id,
            tbl_attendance.work_project_id,
            tbl_staffs.staff_name,
            work_projects.work_project_name,
            COUNT(tbl_attendance.work_project_id) AS total_working_days_in_project
        FROM
            tbl_attendance
        INNER JOIN tbl_employees ON (tbl_employees.emp_id = tbl_attendance.emp_id)
        INNER JOIN tbl_staffs ON (tbl_staffs.st_id = tbl_attendance.st_id)
        JOIN tbl_daily_staff_list ON (tbl_daily_staff_list.dsl_id = tbl_attendance.dsl_id)
        LEFT JOIN work_projects ON (work_projects.work_project_id = tbl_attendance.work_project_id)
        WHERE
            tbl_attendance.work_project_id IS NOT NULL ${query}
        GROUP BY 
            tbl_attendance.work_project_id, tbl_attendance.emp_id
        ORDER BY tbl_employees.sort_code ASC
    `).then(d => {
        return d[0]
    })

    return res.status(200).send(rows)
})

router.post("/addProject", (req, res) => {
    db("work_projects").insert({
        work_project_name: req.body.work_project_name,
        work_project_status: req.body.work_project_status
    }).then((data) => {
        return res.status(200).json({
            message: "Project Added",
            work_project_id: data[0]
        })
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})

router.patch("/updateProject/:work_project_id", (req, res) => {
    if(!req.params.work_project_id) {
        return res.status(500).json({
            message: "Project ID is required"
        })
    }
    
    db("work_projects").where("work_project_id", req.params.work_project_id).update({
        work_project_name: req.body.work_project_name,
        work_project_status: req.body.work_project_status
    }).then(() => {
        return res.status(200).json({
            message: "Project Updated"
        })
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})


router.delete("/deleteProject/:work_project_id", (req, res) => {
    db("work_projects").where("work_project_id", req.params.work_project_id).delete().then(() => {
        return res.status(200).json({
            message: "Project Deleted"
        })
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})

router.patch("/updateStatus/:work_project_id", (req, res) => {
    db("work_projects").where("work_project_id", req.params.work_project_id).update({
        work_project_status: req.body.work_project_status
    }).then(() => {
        return res.status(200).json({
            message: "Project Status Updated"
        })
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})

module.exports = router