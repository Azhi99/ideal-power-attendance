const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/addList", (req, res) => {
  db("tbl_daily_staff_list")
    .insert({
      st_id: req.body.st_id,
      work_date: req.body.work_date,
      user: req.body.user,
      location: req.body.location,
      note: req.body.note,
    })
    .then(([data]) => {
      var dsl_id = data;
      db("tbl_employees")
        .where("st_id", req.body.st_id)
        .andWhere("active_status", "1")
        .andWhereRaw("emp_id not in (select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?))",
          [req.body.work_date]).select([
          "emp_id as emp_id",
          db.raw(dsl_id + " as dsl_id"),
          db.raw("0 as overtime"),
          db.raw("8 as worked_hours"),
          db.raw("0 as fine"),
          db.raw("null as fine_reason"),
          db.raw("'0' as absent"),
          db.raw("'"+ req.body.location.split(",")[0] +"' as location")
        ])
        .then((data) => {
          db("tbl_attendance").insert(data).then(() => {
              db.select(
                "tbl_attendance.at_id as at_id",
                "tbl_attendance.emp_id as emp_id",
                db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
                "tbl_employees.st_id as st_id",
                "tbl_employees.salary_type as salary_type",
                "tbl_attendance.overtime as overtime",
                "tbl_attendance.worked_hours as worked_hours",
                "tbl_attendance.fine as fine",
                "tbl_attendance.fine_reason as fine_reason",
                "tbl_attendance.absent as absent",
                "tbl_attendance.location as location"
              )
                .from("tbl_attendance")
                .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_attendance.emp_id")
                .where("tbl_attendance.dsl_id", dsl_id)
                .then((data) => {
                  return res.status(200).json({
                    message: "List created",
                    dsl_id,
                    employees: data,
                  });
                });
            });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/createRestList", (req, res) => {
  db("tbl_staffs")
    .whereRaw("st_id not in (select st_id from tbl_daily_staff_list where work_date = ?)", [req.body.work_date])
    .select(["st_id"])
    .then((data) => {
      if(data.length == 0){
        return res.status(500).json({
          message: "All staffs has list"
        });
      }
      data.forEach(obj => {
        db("tbl_daily_staff_list").insert({
          st_id: obj.st_id,
          work_date: req.body.work_date,
          user: req.body.user,
          location: "Rest",
          note: null
        }).then(([data]) => {
          var dsl_id = data;
          db("tbl_employees")
            .where("st_id", obj.st_id)
            .andWhere("active_status", "1")
            .andWhereRaw("emp_id not in (select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?))",
              [req.body.work_date]).select([
              "emp_id as emp_id",
              db.raw(dsl_id + " as dsl_id"),
              db.raw("0 as overtime"),
              db.raw("0 as worked_hours"),
              db.raw("0 as fine"),
              db.raw("null as fine_reason"),
              db.raw("if(salary_type = 'Monthly', '2', '1') as absent"),
              db.raw("'Rest' as location")
            ]).then((data) => {
              db("tbl_attendance").insert(data).then(() => {});
            });
        });
      });
      return res.status(200).json({
        message: "Rest List Created"
      });
    })
});

router.patch("/updateList/:dsl_id", (req, res) => {
  db("tbl_daily_staff_list").where("dsl_id", req.params.dsl_id).update({
    location: req.body.location,
    note: req.body.note,
  }).then(()=>{
      return res.status(200).json({
          message:"List Updated"
      })
  }).catch((err)=>{
      return res.status(500).json({
          message:err
      })
  })
});

router.delete('/deleteList/:dsl_id',(req,res)=>{
  return res.status(500).json({
    message: "You can't delete list"
  });
  // db("tbl_attendance").where('dsl_id', req.params.dsl_id).delete().then(() => {
  //   db('tbl_daily_staff_list').where('dsl_id', req.params.dsl_id).delete().then(()=>{
  //     return res.status(200).json({
  //       message:'List deleted'
  //     });
  //   }).catch((err)=>{
  //     return res.status(500).json({
  //       message:err
  //     });
  //   });
  // }).catch((err)=>{
  //   return res.status(500).json({
  //     message:err
  //   });
  // });
});

router.post("/getListAndAttendance", async (req, res) => {
  const [dsl_list] = await db("tbl_daily_staff_list")
                        .where("st_id", req.body.st_id)
                        .andWhere("work_date", req.body.work_date)
                        .select()
                        .limit(1);
  
  var employees = [];
  if(typeof dsl_list != "undefined"){
    employees = await db.select(
      "tbl_attendance.at_id as at_id",
      "tbl_attendance.emp_id as emp_id",
      db.raw("concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name"),
      "tbl_employees.st_id as st_id",
      "tbl_employees.salary_type as salary_type",
      "tbl_attendance.overtime as overtime",
      "tbl_attendance.worked_hours as worked_hours",
      "tbl_attendance.fine as fine",
      "tbl_attendance.fine_reason as fine_reason",
      "tbl_attendance.absent as absent",
      "tbl_attendance.location as location"
    ).from("tbl_attendance")
     .join("tbl_employees", "tbl_employees.emp_id", "=", "tbl_attendance.emp_id")
     .where("tbl_attendance.dsl_id", dsl_list.dsl_id);
  }
  return res.status(200).json({
    dsl_list: dsl_list || null,
    employees
  });
});

router.post("/getStaffs", (req, res) => {
  db.select(
    "tbl_daily_staff_list.dsl_id as dsl_id",
    "tbl_daily_staff_list.st_id as st_id",
    "tbl_staffs.staff_name as staff_name"
  )
   .from("tbl_daily_staff_list")
   .join("tbl_staffs", "tbl_daily_staff_list.st_id", "=", "tbl_staffs.st_id")
   .where("tbl_daily_staff_list.work_date", req.body.work_date)
   .then((data) => {
     return res.status(200).send(data || []);
   });
});

router.post("/getDailyList", (req, res) => {
  db.select(
    "tbl_daily_staff_list.dsl_id as dsl_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_daily_staff_list.user as user",
    "tbl_daily_staff_list.location as location",
    "tbl_daily_staff_list.note as note"
  )
    .from("tbl_daily_staff_list")
    .join("tbl_staffs", "tbl_daily_staff_list.st_id", "=", "tbl_staffs.st_id")
    .where("tbl_daily_staff_list.work_date", new Date().toISOString().split("T")[0])
    .then((data) => {
      return res.status(200).send(data || []);
    });
});

router.post('/dslReport/:month/:year/:st_id', (req, res)=>{
 db.raw('select * from dsl_each_month_by_staff where date_to_m=? and date_to_y=? and st_id=?', [req.params.month,req.params.year,req.params.st_id]).then(([data])=>{ 
  return res.status(200).send(data);
 });
});

router.post('/dslEachAttendance/:dsl_id', (req, res)=>{
  db.raw('select * from dsl_each_attendance where dsl_id=?', [req.params.dsl_id]).then(([data])=>{
    return res.status(200).send(data);
  });
});

module.exports = router;