const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/getData", (req, res) => {
    db("work_projects").select("*").orderBy('sort_code', 'asc').then((data) => {
        return res.status(200).send(data);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        })
    })
})

router.post('/report', async (req, res) => {
    let query = ''
    let query_with = ''

    if(req.body.work_project_id) {
        query += ` AND tbl_attendance.work_project_id = ${req.body.work_project_id}`
    }

    if(req.body.emp_id) {
        query += ` AND tbl_attendance.emp_id = ${req.body.emp_id}`
    }

    if(req.body.st_id) {
        query += ` AND tbl_attendance.st_id = ${req.body.st_id}`
    }

    // if(req.body.month) {
    //     query += ` AND MONTH(tbl_daily_staff_list.work_date) = ${req.body.month}`
    // }

    // if(req.body.year) {
    //     query += ` AND YEAR(tbl_daily_staff_list.work_date) = ${req.body.year}`
    // }

    if(req.body.from && req.body.to) {
        query += ` AND tbl_daily_staff_list.work_date BETWEEN '${req.body.from}' AND '${req.body.to}'`
    }

    // const [rows] = await db.raw(`
    //    WITH project_days AS (
    //         SELECT 
    //             ta.emp_id,
    //             ta.work_project_id,
    //             COUNT(DISTINCT ta.dsl_id) AS days_count
    //         FROM tbl_attendance ta
    //         JOIN tbl_daily_staff_list dsl ON ta.dsl_id = dsl.dsl_id
    //         WHERE ta.work_project_id IS NOT NULL ${query_with}
    //         GROUP BY ta.emp_id, ta.work_project_id
    //     )

    //     SELECT
    //         tbl_employees.emp_id,
    //         CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS employee_full_name,
    //         tbl_employees.job,
    //         tbl_employees.country,
    //         tbl_employees.sort_code,
    //         tbl_staffs.staff_name,
    //         project_days.work_project_id,
    //         work_projects.work_project_name,
    //         project_days.days_count AS total_working_days_in_project,
    //         employee_final_with_give_salary.salary_type,
    //         employee_final_with_give_salary.monthly_salary,
    //         employee_final_with_give_salary.daily_salary,
    //         tbl_employees.hour_salary,
    //         employee_final_with_give_salary.date_to_m,
    //         employee_final_with_give_salary.date_to_y,
    //         tbl_employees.st_id,
    //         employee_final_with_give_salary.total_o,
    //         employee_final_with_give_salary.total_fine,
    //         employee_final_with_give_salary.total_expense,
    //         employee_final_with_give_salary.total_transport,
    //         employee_final_with_give_salary.total_food,
    //         employee_final_with_give_salary.total_loan,
    //         employee_final_with_give_salary.total_accomodation,
    //         employee_final_with_give_salary.loan_by_accomodation,
    //         employee_final_with_give_salary.accomodation_by_accomodation,
    //         employee_final_with_give_salary.expense_by_accomodation,
    //         employee_final_with_give_salary.fine_by_accomodation,
    //         employee_final_with_give_salary.total_f,
    //         employee_final_with_give_salary.total_h_not_work,
    //         (employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) AS total_hour,
    //         employee_final_with_give_salary.total_o_s,
    //         employee_final_with_give_salary.food_money,
    //         employee_final_with_give_salary.transport_money,
    //         employee_final_with_give_salary.cabina_money,
    //         employee_final_with_give_salary.expense_money,
    //         employee_final_with_give_salary.fine_money,
    //         employee_final_with_give_salary.loan_money,
    //         employee_final_with_give_salary.accomodation_money,
    //         employee_final_with_give_salary.other_expense,
    //         employee_final_with_give_salary.other_minus,
    //         employee_final_with_give_salary.added_days,
    //         employee_final_with_give_salary.added_overtime,
    //         employee_final_with_give_salary.gs_id
    //     FROM tbl_employees
    //     JOIN employee_final_with_give_salary 
    //         ON tbl_employees.emp_id = employee_final_with_give_salary.emp_id
    //     JOIN project_days
    //         ON project_days.emp_id = tbl_employees.emp_id
    //     JOIN tbl_staffs
    //         ON tbl_staffs.st_id = tbl_employees.st_id
    //     LEFT JOIN work_projects 
    //         ON work_projects.work_project_id = project_days.work_project_id
    //     WHERE 1=1 ${query}
    //     ORDER BY tbl_employees.sort_code ASC

    //     `)

    const rows = await db.raw(`
        SELECT 
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS employee_full_name,
            tbl_employees.daily_salary,  
            tbl_employees.monthly_salary,  
            tbl_employees.salary_type,  
            tbl_employees.food_money,  
            tbl_employees.other_expense,  
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
            tbl_attendance.work_project_id IS NOT NULL AND tbl_attendance.absent IN ('2', '0') ${query}
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
    }).then(async (data) => {
        const [[{ sort_code }]] = await db.raw(`select IFNULL(max(sort_code), 0) as sort_code from work_projects where work_project_status = 'enabled' `)
        await db('work_projects').where('work_project_id', data).update({
            sort_code: sort_code + 1
        })
            
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

router.get('/getStaffProjects', async (req, res) => {
    const [rows] = await db.raw(`
            SELECT
                staff_work_projects.staff_work_project_id,
                staff_work_projects.st_id,
                staff_work_projects.work_project_id,
                tbl_staffs.staff_name,
                tbl_staffs.special_staff,
                tbl_staffs.staff_sort_code,
                work_projects.work_project_name
            FROM
                staff_work_projects 
                JOIN tbl_staffs ON (tbl_staffs.st_id = staff_work_projects.st_id)
                LEFT JOIN work_projects ON (work_projects.work_project_id = staff_work_projects.work_project_id)
            WHERE tbl_staffs.show_staff = '1'
            ORDER BY tbl_staffs.staff_sort_code ASC
        `)

    return res.status(200).send(rows)
})

router.patch('/updateStaffProject/:staff_work_project_id', async (req, res) => {
    await db('staff_work_projects').where('staff_work_project_id', req.params.staff_work_project_id).update({
        work_project_id: req.body.work_project_id
    })

    return res.status(200).json({
        message: 'Staff Project Updated'
    })
})

router.post('/saveSortProjects', async (req, res) => {
    const list = req.body.list
    for(let i = 0; i < list.length; i++) {
        await db('work_projects').where('work_project_id', list[i].work_project_id).update({
            sort_code: i
        })
    }

    return res.sendStatus(200);
})

module.exports = router