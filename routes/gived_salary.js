const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addGiveSalary", (req, res) => {
    db("tbl_gived_salary").insert({
        emp_id: req.body.emp_id,
        salary_month: req.body.salary_month,
        salary_year: req.body.salary_year,
        monthly_salary: req.body.monthly_salary,
        daily_salary: req.body.daily_salary,
        hour_salary: req.body.hour_salary,
        dollar_price: req.body.dollar_price,
        gived_status: "1",
        food_money: req.body.food_money,
        transport_money: req.body.transport_money
    }).then(([data]) => {
        return res.status(200).json({
            gs_id: data,
            message: "Salary Gived"
        });
    }).catch((err) => {
        if(err.errno == 1062){
            return res.status(500).json({
                message: "This Employee has gived salary"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});


router.post('/addListOfEmployees/:st_id', async (req, res) => {
    const existAcsNumber = await db.raw(`
        SELECT 
            acs_numbers.*,
            tbl_staffs.staff_name
        FROM acs_numbers 
            JOIN tbl_staffs ON acs_numbers.st_id = tbl_staffs.st_id
        WHERE acs_numbers.acs_number = '${req.body.acs_number}' AND acs_numbers.year = ${req.body.salary_year}
    `).then(result => result[0][0] || null);

    if(existAcsNumber){
        return res.status(500).json({
            message: "ACS Number already exists for the year by staff: " + existAcsNumber.staff_name
        });
    }

    db("tbl_employees")
      .whereRaw(`
        emp_id in (
            select emp_id from tbl_attendance where dsl_id in (
                select dsl_id from tbl_daily_staff_list where MONTH(work_date) = ${req.body.salary_month} and year(work_date) = ${req.body.salary_year}
            ) and old_st_id = ${req.params.st_id}
        )
      `)
      .andWhere("st_id", req.params.st_id)
      .andWhereRaw("emp_id not in (select emp_id from tbl_gived_salary where salary_month=? and salary_year=?)", [req.body.salary_month, req.body.salary_year])
      .select([
        "emp_id",
        db.raw(req.body.salary_month + " as salary_month"),
        db.raw(req.body.salary_year + " as salary_year"),
        "monthly_salary",
        "daily_salary",
        "hour_salary",
        db.raw(req.body.dollar_price + " as dollar_price"),
        db.raw("'1' as gived_status"),
        "food_money",
        "transport_money",
        "cabina_money",
        "guarantee",
        "fine_money",
        "expense_money",
        "loan_money",
        "accomodation_money",
        "other_expense",
        "other_minus",
        "salary_type"
      ]).then((data) => {
        db("tbl_gived_salary").where("salary_month", req.body.salary_month).andWhere("salary_year", req.body.salary_year).update({
            dollar_price: req.body.dollar_price
        }).then(() => { });
        if(data.length > 0){
            db("tbl_gived_salary").insert(data).then(() => {
                db("pre_gived_salary")
                .where("st_id", req.params.st_id)
                .andWhere("salary_month", req.body.salary_month)
                .andWhere("salary_year", req.body.salary_year)
                .select().then(async (data) => {
                    let new_acs_id = null
                    if(req.body.acs_number) {
                        [new_acs_id] = await db('acs_numbers').insert({
                            st_id: req.params.st_id,
                            month: req.body.salary_month,
                            year: req.body.salary_year,
                            acs_number: req.body.acs_number
                        })
                    }

                    // let last_acs_number = await db.raw(`
                    //     SELECT MAX(CAST(acs_number AS UNSIGNED)) as last_acs_number FROM acs_numbers WHERE year = ${req.body.salary_year}
                    // `).then(result => result[0][0].last_acs_number || null);

                    // last_acs_number = last_acs_number ? parseInt(last_acs_number) + 1 : 1

                    try {

                        [new_acs_id] = await db('acs_numbers').insert({
                            st_id: req.params.st_id,
                            month: req.body.salary_month,
                            year: req.body.salary_year,
                            acs_number: last_acs_number.toString()
                        })
                    } catch (error) {
                        console.log('e: ', error);
                        
                    }
                    
                    return res.status(200).send({
                        rows: data,
                        acs_number_id: new_acs_id
                    })
                });
            });
        } else {
            return res.status(500).json({
                message: "All employees calculated"
            });
        }
      });
});

router.delete('/deleteGiveSalary/:month/:year/:st_id', (req, res) => {
    db.raw(`
        delete from tbl_gived_salary where emp_id in (
            select emp_id from tbl_employees where st_id=${req.params.st_id}
        ) and salary_month=${req.params.month} and salary_year=${req.params.year}
    `).then(() => {
        res.sendStatus(200)
    }).catch(() => {
        res.sendStatus(500)
    })
})

router.post('/getPreGivedSalary/:st_id/:month/:year', async (req, res) => {
    const rows = await db("pre_gived_salary")
      .where("st_id", req.params.st_id)
      .andWhere("salary_month", req.params.month)
      .andWhere("salary_year", req.params.year)
      .select()

        const last_acs_number = await db.raw(`
            SELECT MAX(CAST(acs_number AS UNSIGNED)) as last_acs_number FROM acs_numbers WHERE year = ${req.params.year}
        `).then(result => result[0][0].last_acs_number || null);

      const acs_number = await db('acs_numbers').where('st_id', req.params.st_id).andWhere('month', req.params.month).andWhere('year', req.params.year).select().first()
        return res.status(200).json({
            rows,
            acs_number: acs_number || {},
            last_acs_number
        });
});

router.post('/getLastAcsNumber/:year', (req, res) => {
    db.raw(`
        SELECT MAX(acs_number) as last_acs_number FROM acs_numbers WHERE year = ${req.params.year}
    `).then(result => {
        return res.status(200).json({
            last_acs_number: result[0][0].last_acs_number || null
        });
    });
})

router.post('/getLastUsedAcsNumbers/:year', (req, res) => {
    db.raw(`
        SELECT 
            acs_numbers.*,
            tbl_staffs.staff_name
        FROM 
            acs_numbers
            JOIN tbl_staffs ON (acs_numbers.st_id = tbl_staffs.st_id)
        WHERE acs_numbers.year = ?
        ORDER BY acs_numbers.acs_number_id DESC
    `, [req.params.year]).then(d => {
        return res.status(200).send(d[0])
    }).catch(err => {
        return res.status(500).send({
            err
        })
    })
})

router.post("/employeeInfo/:month/:year/:phone", (req, res) => {
    db.select(
        "tbl_gived_salary.gs_id"
    )
    .from("tbl_gived_salary")
    .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_gived_salary.emp_id")
    .where("tbl_gived_salary.salary_month", req.params.month)
    .andWhere("tbl_gived_salary.salary_year", req.params.year)
    .andWhere("tbl_employees.phone", req.params.phone)
    .then((data) => {
        if(data.length == 0){
            return res.status(500).json({
                message: "Data Not found"
            });
        }
        return res.status(200).json({
            message: "Data Found"
        });
    });
});

router.post("/getGivedSalary/:month/:year", async (req, res) => {
    const employees = await db("employee_final_with_give_salary")
                            .where("date_to_m", req.params.month)
                            .andWhere("date_to_y", req.params.year)
                            .andWhere("gived_status", "1").select([
                                "emp_id",
                                "full_name",
                                "staff_name",
                                "salary_type",
                                "total_o_s as total_overtime",
                                "total_fine",
                                "gived_salary"
                        ]);
    const gived_salary_staffs = await db("total_gived_each_staff")
                                    .where("date_to_m", req.params.month)
                                    .andWhere("date_to_y", req.params.year)
                                    .select();
                                    
    return res.status(200).json({
        employees,
        gived_salary_staffs
    });
});

router.post('/addGivedDetail',(req,res)=>{
    db('tbl_gived_salary_detail').insert({
        gs_id:req.body.gs_id,
        gived_salary:req.body.gived_salary,
        gived_date:db.fn.now()
    }).then(([data])=>{
        return res.status(200).json({
            gsd_id: data,
            message: "Salary inserted"
        });
    }).catch((err)=>{
        return res.status(500).json({
            message: err
        });
    });
});

router.post('/changeAddedDays', (req,res) => {
    db('tbl_gived_salary').where('gs_id', req.body.gs_id).update({
        added_days: req.body.added_days
    }).then(() => {
        return res.status(200).json({
            message: "Added Days Changed"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post('/saveAddedDaysAndOvertime', (req,res) => {
    const list = req.body.list
    for(let i = 0; i < list.length; i++){
        db('tbl_gived_salary').where('gs_id', list[i].gs_id).update({
            added_days: list[i].added_days,
            added_overtime: list[i].added_overtime
        }).then(() => {
            if(i == list.length - 1){
                return res.status(200).json({
                    message: "Added Days and Overtime Changed"
                });
            }
        }).catch((err) => {
            return res.status(500).json({
                message: err
            });
        });
    }
})

router.post('/changeAddedOvertime', (req,res) => {
    db('tbl_gived_salary').where('gs_id', req.body.gs_id).update({
        added_overtime: req.body.added_overtime
    }).then(() => {
        return res.status(200).json({
            message: "Added Overtime Changed"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

module.exports = router;