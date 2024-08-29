const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post("/addAttendance", (req, res) => {
    db("tbl_attendance").insert({
        dsl_id: req.body.dsl_id,
        emp_id: req.body.emp_id,
        overtime: 0,
        worked_hours: (req.body.absent == '1' || req.body.absent == '2' ? '0' : '8'),
        fine: 0,
        fine_reason: null,
        expense: 0,
        expense_reason: null,
        transport: 0,
        transport_reason: null,
        food: 0,
        food_reason: null,
        loan: 0,
        loan_reason: null,
        accomodation: 0,
        accomodation_reason: null,
        absent: req.body.absent,
        location: req.body.location,
        st_id: req.body.st_id,
        old_st_id: req.body.st_id
    }).then(async ([data]) => {
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                داخڵکردنی ${req.body.employee}
            `).trim()
        });
        return res.status(200).json({
            message: "Attendance Added",
            at_id: data
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.post("/getMissedEmployees", (req, res) => {
    db("tbl_employees")
      .where("st_id", req.body.st_id)
      .andWhere("active_status", "1")
      .andWhereRaw("emp_id not in (select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?))", [req.body.work_date])
      .select([
        "emp_id",
        db.raw("concat(first_name, ' ', last_name) as full_name"),
        "salary_type"
      ])
      .then((data) => {
        return res.status(200).send(data);
      });
});

router.patch("/setAbsent/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "1",
        worked_hours: 0,
        overtime: 0,
        fine: 0,
        fine_reason: null,
        location: '',
        expense: 0,
        expense_reason: null,
        food: 0,
        food_reason: null,
        transport: 0,
        transport_reason: null,
        loan: 0,
        loan_reason: null,
        accomodation: 0,
        accomodation_reason: null
    }).then(async () => {
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                غیاب کردنی ${req.body.employee}
            `).trim()
        })
        return res.status(200).json({
            message: "Absented"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/cancelAbsent/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "0",
        worked_hours: 8
    }).then(async () => {
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                لابردنی غیابی ${req.body.employee}
            `).trim()
        })
        return res.status(200).json({
            message: "Absent canceled"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch("/setOff/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        absent: "2",
        worked_hours: 0,
        overtime: 0
    }).then(async () => {
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                پشووی ${req.body.employee}
            `).trim()
        })
        return res.status(200).json({
            message: "Setted to Off"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

router.patch('/setWork/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).update({
        work: req.body.work || null
    }).then(async ()=>{
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                جۆری کاری ${req.body.employee} بۆ ${req.body.work || ''}
            `).trim()
        })
        return res.status(200).json({
            message:'Setted Work'
        });
    }).catch((err)=>{
        return res.status(500).json({
            message:err
        });
    });
})


router.patch('/updateAttendance/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).select().first().then(async (data)=>{
        db('tbl_attendance').where('at_id', req.params.at_id).update({
            fine:req.body.fine,
            fine_reason:req.body.fine_reason || null,
            expense: req.body.expense || 0,
            expense_reason: req.body.expense_reason || null,
            transport: req.body.transport || 0,
            transport_reason: req.body.transport_reason || null,
            food: req.body.food || 0,
            food_reason: req.body.food_reason || null,
            loan: req.body.loan || 0,
            loan_reason: req.body.loan_reason || null,
            accomodation: req.body.accomodation || 0,
            accomodation_reason: req.body.accomodation_reason || null,
        }).then(async ()=>{
            var work = (`
                گۆڕینی داتای ${req.body.employee}
                ${data.fine != req.body.fine ? `غرامە لە ${Number(data.fine).toLocaleString()} بۆ ${Number(req.body.fine).toLocaleString()}` : ''}
                ${data.fine_reason != req.body.fine_reason ? `هۆکاری غرامە لە ${data.fine_reason || ''} بۆ: ${req.body.fine_reason || ''}` : ''}
                ${data.expense != req.body.expense ? `خەرجی لە ${Number(data.expense).toLocaleString()} بۆ ${Number(req.body.expense).toLocaleString()}` : ''}
                ${data.expense_reason != req.body.expense_reason ? `هۆکاری خەرجی لە ${data.expense_reason || ''} بۆ: ${req.body.expense_reason || ''}` : ''}
                ${data.transport != req.body.transport ? `هاتووچۆ لە ${Number(data.transport).toLocaleString()} بۆ ${Number(req.body.transport).toLocaleString()}` : ''}
                ${data.transport_reason != req.body.transport_reason ? `هۆکاری هاتووچۆ لە ${data.transport_reason || ''} بۆ: ${req.body.transport_reason || ''}` : ''}
                ${data.food != req.body.food ? `خواردن لە ${Number(data.food).toLocaleString()} بۆ ${Number(req.body.food).toLocaleString()}` : ''}
                ${data.food_reason != req.body.food_reason ? `هۆکاری خواردن لە ${data.food_reason || ''} بۆ: ${req.body.food_reason || ''}` : ''}
                ${data.loan != req.body.loan ? `قەرز لە ${Number(data.loan).toLocaleString()} بۆ ${Number(req.body.loan).toLocaleString()}` : ''}
                ${data.loan_reason != req.body.loan_reason ? `هۆکاری قەرز لە ${data.loan_reason || ''} بۆ: ${req.body.loan_reason || ''}` : ''}
                ${data.accomodation != req.body.accomodation ? `ئیقامە لە ${Number(data.accomodation).toLocaleString()} بۆ ${Number(req.body.accomodation).toLocaleString()}` : ''}
                ${data.accomodation_reason != req.body.accomodation_reason ? `هۆکاری ئیقامە لە ${data.accomodation_reason || ''} بۆ: ${req.body.accomodation_reason || ''}` : ''}
            `).trim();
            if(work.split('\n').length > 1) {
                const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
                baghdadTime.setHours(baghdadTime.getHours() - 4)
                req.body.datetime_log = baghdadTime
                await db('tbl_log').insert({
                    dsl_id: req.body.dsl_id,
                    st_id: req.body.st_id,
                    user: req.body.user,
                    datetime_log: req.body.datetime_log,
                    work: work
                });
            }
            return res.status(200).json({
                message:'Update'
            });
        }).catch((err)=>{
            return res.status(500).json({
                message:err
            });
        });
    })
});

router.patch('/setWorkedHours/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).select().first().then((data)=>{
        db('tbl_attendance').where('at_id', req.params.at_id).update({
            worked_hours: req.body.worked_hours
        }).then(async ()=>{
            // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
            //     datetime_list: req.body.datetime_list
            // })
            if(data.worked_hours != req.body.worked_hours) {
                const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
                baghdadTime.setHours(baghdadTime.getHours() - 4)
                req.body.datetime_log = baghdadTime
                await db('tbl_log').insert({
                    dsl_id: req.body.dsl_id,
                    st_id: req.body.st_id,
                    user: req.body.user,
                    datetime_log: req.body.datetime_log,
                    work: (`
                        گۆڕینی کاتی کارکردنی ${req.body.employee} لە ${data.worked_hours} بۆ ${req.body.worked_hours} کاتژمێر
                    `).trim()
                });
            }
            return res.status(200).json({
                message: 'Update'
            });
        }).catch((err)=>{
            return res.status(500).json({
                message: err
            });
        });
    })
});

router.patch('/setOvertime/:at_id',(req, res)=>{
    db('tbl_attendance').where('at_id', req.params.at_id).select().first().then((data)=>{
        db('tbl_attendance').where('at_id', req.params.at_id).update({
            overtime: req.body.overtime
        }).then(async ()=>{
            // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
            //     datetime_list: req.body.datetime_list
            // })
            if(data.overtime != req.body.overtime) {
                const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
                baghdadTime.setHours(baghdadTime.getHours() - 4)
                req.body.datetime_log = baghdadTime
                await db('tbl_log').insert({
                    dsl_id: req.body.dsl_id,
                    st_id: req.body.st_id,
                    user: req.body.user,
                    datetime_log: req.body.datetime_log,
                    work: (`
                        گۆڕینی کاتی زیادەی ${req.body.employee} لە ${data.overtime} بۆ ${req.body.overtime} کاتژمێر
                    `).trim()
                });
            }
            return res.status(200).json({
                message: 'Update'
            });
        }).catch((err)=>{
            return res.status(500).json({
                message: err
            });
        });
    })
});

router.patch("/setLocation/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).update({
        location: req.body.location
    }).then(async () => {
        // await db('tbl_daily_staff_list').where('dsl_id', req.body.dsl_id).update({
        //     datetime_list: req.body.datetime_list
        // })
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                گۆڕینی شوێنی ${req.body.employee} بۆ ${req.body.location}
            `).trim()
        });
        return res.status(200).json({
            message: "Updated"
        });
    });
});

router.patch("/updateAttendancesLocation", (req, res) => {
    db("tbl_attendance").whereIn("at_id", req.body.emps).update({
        location: req.body.location
    }).then(async () => {
        const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
        baghdadTime.setHours(baghdadTime.getHours() - 4)
        req.body.datetime_log = baghdadTime
        await db('tbl_log').insert({
            dsl_id: req.body.dsl_id,
            st_id: req.body.st_id,
            user: req.body.user,
            datetime_log: req.body.datetime_log,
            work: (`
                گۆڕینی شوێنەکانی کارکردنی بۆ ${req.body.location ? req.body.location : ""}
            `).trim()
        });
        return res.status(200).json({
            message: "Updated"
        });
    });
});

router.patch("/changeStaff/:at_id/:st_id/:work_date/:old_st_id", (req, res) => {
    db("tbl_daily_staff_list").where("st_id", req.params.st_id).andWhere("work_date", req.params.work_date).select(["dsl_id as dsl_id"]).then(([dsl_id]) => {
        if(typeof dsl_id != "undefined"){
            dsl_id = dsl_id.dsl_id;
            db("tbl_daily_staff_list").where("dsl_id", dsl_id).select(["location"]).limit(1).then(([{location}]) => {
                db("tbl_attendance").where("at_id", req.params.at_id).update({
                    dsl_id: dsl_id,
                    location: location.split(",")[0]
                }).then(() => {
                    db("tbl_attendance").where("at_id", req.params.at_id).update({
                        st_id: req.params.st_id
                    }).then(() => {
                        return res.status(200).json({
                            message: "List changed"
                        });
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        message: err
                    });
                });
            });
        } else {
            db("tbl_temp_attendance").insert({
                st_id: req.params.st_id,
                old_st_id: req.params.old_st_id,
                emp_id: req.body.emp_id,
                overtime: req.body.overtime,
                worked_hours: req.body.worked_hours,
                fine: req.body.fine,
                fine_reason: req.body.fine_reason,
                expense: req.body.expense || 0,
                expense_reason: req.body.expense_reason || null,
                transport: req.body.transport || 0,
                transport_reason: req.body.transport_reason || null,
                food: req.body.food || 0,
                food_reason: req.body.food_reason || null,
                loan: req.body.loan || 0,
                loan_reason: req.body.loan_reason || null,
                accomodation: req.body.accomodation || 0,
                accomodation_reason: req.body.accomodation_reason || null,
                absent: req.body.absent,
                work_date: req.body.work_date
            }).then(() => {
                db("tbl_attendance").where("at_id", req.params.at_id).delete().then(() => {
                    return res.status(200).json({
                        message: "List changed"
                    });
                });
            });
        }
    });
});

router.get("/getTransferedEmployees/:year/:month/:old_st_id", (req, res) => {
    db.select(
        "tbl_temp_attendance.t_at_id as t_at_id",
        db.raw("CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as employee"),
        "tbl_staffs.staff_name as staff_name",
        "tbl_temp_attendance.work_date as work_date"
    ).from("tbl_temp_attendance")
     .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_temp_attendance.emp_id")
     .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_temp_attendance.st_id")
     .whereRaw("YEAR(tbl_temp_attendance.work_date) = ?", [req.params.year])
     .andWhereRaw("MONTH(tbl_temp_attendance.work_date) = ?", [req.params.month])
     .andWhere("tbl_temp_attendance.old_st_id", req.params.old_st_id)
     .then((data) => {
        return res.status(200).send(data);
     });
});

router.patch("/returnEmployee/:at_id/:st_id", (req, res) => {
    db("tbl_daily_staff_list").where("st_id", req.params.st_id).andWhere("work_date", req.body.work_date).select([
        "dsl_id",
        "location"
    ]).limit(1).then(([{dsl_id, location}]) => {
        db("tbl_attendance").where("at_id", req.params.at_id).update({
            dsl_id,
            st_id: req.params.st_id,
            location: location.split(",")[0]
        }).then(() => {
            return res.status(200).json({
                message: "Employee Returned"
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: err
            });
        });
    });
});

router.delete("/deleteAttendance/:at_id", (req, res) => {
    db("tbl_attendance").where("at_id", req.params.at_id).delete().then(() => {
        return res.status(200).json({
            message: "Attendance deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
});

module.exports = router;
