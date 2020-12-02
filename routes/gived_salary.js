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


router.post('/addListOfEmployees/:st_id', (req, res) => {
    db("tbl_employees")
      .where("active_status", "1")
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
      ]).then((data) => {
        if(data.length > 0){
            return res.status(200).json({
                message: "success"
            });
        } else {
            return res.status(500).json({
                message: "All employees calculated"
            });
        }
      });
});

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

module.exports = router;