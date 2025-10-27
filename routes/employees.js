const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path")
const multer = require("multer");
const db = require("../DB/mainDBconfig.js");
const {
  createValidation,
  updateValidation,
  checkID,
} = require("../validators/employees.js");

const storage = multer.diskStorage({
  destination: './employee_images/',
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})

const documentsStorage = multer.diskStorage({
  destination: './employee_documents/',
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const mimeType = file.mimetype
    if(['image/png', 'image/jpg', 'image/jpeg'].includes(mimeType)) {
      return cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Invalid file type'))
    }
  }
}).single('personal_image')

const uploadDocuments = multer({
  storage: documentsStorage,
  fileFilter: function (req, file, cb) {
    const mimeType = file.mimetype
    if(['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(mimeType)) {
      return cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Invalid file type'))
    }
  }
}).array('documents', 20)

const router = express.Router();
// router.use(fileUpload());

router.post("/addEmployee", async (req, res) => {
  upload(req, res, async function (err) {
    if(err instanceof multer.MulterError) {
      return res.status(500).json({
        message: err.message
      })
    } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == 'ExtensionError') {
            res.status(400).json({
                error: {
                    message: err.message
                }
            }).end();
        } else {
            res.status(400).json({
                error: {
                    message: `unknown uploading error: ${err.message}`
                }
            }).end();
        }
        return;
    }

    let personal_image_path = null;
    if(req.file) {
      personal_image_path = req.file.filename
    }

    const exist = await db.raw(`
      SELECT 
        tbl_employees.*,
        tbl_staffs.staff_name
      FROM tbl_employees
      JOIN tbl_staffs ON (tbl_staffs.st_id = tbl_employees.st_id)
      WHERE tbl_employees.first_name = ? AND tbl_employees.last_name = ?
    `, [req.body.first_name, req.body.last_name])
  
    if (exist[0].length > 0) {
      return res.status(500).json({
        message: "Employee exist on staff " + exist[0][0].staff_name + " with status " + (exist[0][0].active_status === "1" ? "Active" : "Deactive"),
      });
    }
   
    for (const key in req.body) {
      if (req.body[key] === "null") {
        req.body[key] = null;
      }
    }
  
    db("tbl_employees")
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        st_id: req.body.st_id,
        phone: req.body.phone,
        birth_date: req.body.birth_date,
        reg_date: db.fn.now(),
        salary_type: req.body.salary_type,
        monthly_salary: req.body.monthly_salary,
        daily_salary: req.body.daily_salary,
        hour_salary: req.body.hour_salary,
        identification_image_path: null,
        personal_image_path,
        active_status:"1",
        country: req.body.country,
        city: req.body.city,
        food_money: req.body.food_money,
        transport_money: req.body.transport_money,
        cabina_money: req.body.cabina_money,
        guarantee: req.body.guarantee,
        expense_money: req.body.expense_money,
        fine_money: req.body.fine_money,
        loan_money: req.body.loan_money,
        accomodation_money: req.body.accomodation_money,
        other_expense: req.body.other_expense,
        other_minus: req.body.other_minus,
        expiry_passport: req.body.expiry_passport || null,
        passport_number: req.body.passport_number || null,
        expire_accomodation: req.body.expire_accomodation || null,
        accomodation_number: req.body.accomodation_number || null,
        asaish_code: req.body.asaish_code || null,
        phone2: req.body.phone2 || null,
        car: req.body.car || null,
        car_number: req.body.car_number || null,
        living_location: req.body.living_location || null,
        first_work_date: req.body.first_work_date || null,
        job: req.body.job || null,
        blood_group: req.body.blood_group || null,
        family_number_1: req.body.family_number_1 || null,
        family_number_2: req.body.family_number_2 || null,
        certificate: req.body.certificate || null,
        office: req.body.office || 'false',
        language: req.body.language || null,
        electricity_works: req.body.electricity_works || null,
        other_works: req.body.other_works || null,
        skill: req.body.skill || null,
        religion: req.body.religion || null,
        religion_type: req.body.religion_type || null,
      })
      .then(async ([data]) => {
        
        const [[{ sort_code }]] = await db.raw(`select IFNULL(max(sort_code), 0) as sort_code from tbl_employees where st_id = ${req.body.st_id} and active_status = '1'`);
        await db("tbl_employees").where("emp_id", data).update({ sort_code: sort_code + 1 })

        const [[{ office_sort_code }]] = await db.raw(`select IFNULL(max(office_sort_code), 0) as office_sort_code from tbl_employees`);
        await db("tbl_employees").where("emp_id", data).update({ office_sort_code: office_sort_code + 1 })
        
        return res.status(200).json({
          message: "Employee Added",
          emp_id: data,
          identification_image_path: null,
          personal_image_path,
        });
      })
      .catch((err) => {
        console.log(err)
        if (err.errno === 1062) {
          return res.status(500).json({
            message: "The phone number already exist, please change it",
          });
        }
        return res.status(500).json({
          message: err,
        })
      })
  })
})

/* 
    First select staff id of the employee as old staff id
    if old staff id != new staff id, log the change and get the change id
    finally update the employee information, if err occur during the update then delete the log if it's logged
*/
router.patch("/updateEmployee/:emp_id", updateValidation, (req, res) => {
  var sle_id = null;
  db("tbl_employees")
    .where("emp_id", req.params.emp_id)
    .select(["st_id as old_st_id"])
    .then(async ([{ old_st_id }]) => {
      if (req.body.st_id != old_st_id) {
        [sle_id] = await db("tbl_staff_log_employee").insert({
          emp_id: req.params.emp_id,
          old_staff_id: old_st_id,
          new_staff_id: req.body.st_id,
          change_date: db.fn.now(),
        });
      }
    })
    .finally(() => {
      db("tbl_employees")
        .where("emp_id", req.params.emp_id)
        .update({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          st_id: req.body.st_id,
          cabina_id: req.body.cabina_id,
          phone: req.body.phone,
          birth_date: req.body.birth_date,
          salary_type: req.body.salary_type,
          monthly_salary: req.body.monthly_salary,
          daily_salary: req.body.daily_salary,
          hour_salary: req.body.hour_salary,
          country: req.body.country,
          city: req.body.city,
          food_money: req.body.food_money,
          transport_money: req.body.transport_money,
          cabina_money: req.body.cabina_money,
          guarantee: req.body.guarantee,
          expense_money: req.body.expense_money,
          fine_money: req.body.fine_money,
          loan_money: req.body.loan_money,
          accomodation_money: req.body.accomodation_money,
          other_expense: req.body.other_expense,
          other_minus: req.body.other_minus,
          expiry_passport: req.body.expiry_passport || null,
          passport_number: req.body.passport_number || null,
          expire_accomodation: req.body.expire_accomodation || null,
          accomodation_number: req.body.accomodation_number || null,
          asaish_code: req.body.asaish_code || null,
          phone2: req.body.phone2 || null,
          car: req.body.car || null,
          car_number: req.body.car_number || null,
          living_location: req.body.living_location || null,
          first_work_date: req.body.first_work_date || null,
          job: req.body.job || null,
          blood_group: req.body.blood_group || null,
          family_number_1: req.body.family_number_1 || null,
          family_number_2: req.body.family_number_2 || null,
          certificate: req.body.certificate,
          office: req.body.office || 'false',
          language: req.body.language || null,
          electricity_works: req.body.electricity_works || null,
          other_works: req.body.other_works || null,
          skill: req.body.skill || null,
          religion: req.body.religion || null,
          religion_type: req.body.religion_type || null,
        })
        .then(() => {
          return res.status(200).json({
            message: "Employee Updated",
          });
        })
        .catch((err) => {
          if (sle_id != null) {
            db("tbl_staff_log_employee")
              .where("sle_id", sle_id)
              .delete()
              .then(() => {});
          }
          if (err.errno === 1062) {
            return res.status(500).json({
              message: "The phone number already exist, please change it",
            });
          }
          return res.status(500).json({
            message: err,
          });
        });
    });
});

// Move new image, unlink old image, update image path
router.patch("/updateIdentificationImage/:emp_id", checkID, (req, res) => {
  if (req.files && req.files.identification_image != null) {
    var image_name = req.files.identification_image.name;
    const ext = image_name.substring(image_name.lastIndexOf(".") + 1);
    if (["jpeg", "jpg", "png"].includes(ext.toLowerCase())) {
      req.files.identification_image.name = new Date().getTime() + "." + ext;
      image_name = req.files.identification_image.name;
      req.files.identification_image.mv(
        "./public/employee_id_images/" + image_name,
        async function (err) {
          if (err) {
            return res.status(500).json({
              message: err,
            });
          }
          const [{ old_image }] = await db("tbl_employees")
            .where("emp_id", req.params.emp_id)
            .select(["identification_image_path as old_image"])
            .limit(1);
          if (old_image != null) {
            fs.unlinkSync("./public" + old_image.slice(1));
          }
          db("tbl_employees")
            .where("emp_id", req.params.emp_id)
            .update({
              identification_image_path: "./employee_id_images/" + image_name,
            })
            .then(() => {
              return res.status(200).json({
                message: "Identification image updated",
                identification_image_path: "./employee_id_images/" + image_name,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                message: err,
              });
            });
        }
      );
    } else {
      return res.status(500).json({
        message: "Invalid image type",
      });
    }
  } else {
    return res.status(500).json({
      message: "Select an image",
    });
  }
});

router.get('/getOfficeEmployees', (req, res) => {
  db.raw(`
    SELECT  
      tbl_employees.emp_id as emp_id,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name,
      tbl_employees.office_sort_code as sort_code
      FROM tbl_employees
      WHERE tbl_employees.office = 'true' AND tbl_employees.active_status = '1'
      ORDER BY tbl_employees.office_sort_code  ASC
  `).then(data => {
    return res.status(200).send(data[0])
  })
})

router.patch("/deactiveEmployee/:emp_id", checkID, (req, res) => {
  db("tbl_employees")
    .where("emp_id", req.params.emp_id)
    .update({
      active_status: "0",
    })
    .then(() => {
      db("tbl_active_log_employee")
        .insert({
          emp_id: req.params.emp_id,
          change_type: "Set to Deactive",
          change_date: db.fn.now(),
        })
        .then(() => {
          return res.status(200).json({
            message: "Employee Deactived",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/activeEmployee/:emp_id", checkID, (req, res) => {
  db("tbl_employees")
    .where("emp_id", req.params.emp_id)
    .update({
      active_status: "1",
    })
    .then(() => {
      db("tbl_active_log_employee")
        .insert({
          emp_id: req.params.emp_id,
          change_type: "Set to Active",
          change_date: db.fn.now(),
        })
        .then(() => {
          return res.status(200).json({
            message: "Employee Actived",
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.delete("/deleteIdentificationImage/:emp_id", checkID, (req, res) => {
  db("tbl_employees")
    .where("emp_id", req.params.emp_id)
    .select(["identification_image_path as image"])
    .limit(1)
    .then(([{ image }]) => {
      if (image != null) {
        fs.unlinkSync("./public" + image.slice(1));
      }
      db("tbl_employees")
        .where("emp_id", req.params.emp_id)
        .update({
          identification_image_path: null,
        })
        .then(() => {
          return res.status(200).json({
            message: "Identification Image deleted",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: err,
          });
        });
    });
});


router.post("/getData", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",

  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .offset(req.body.offset)
    .limit(15)
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getAll", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getActived", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.active_status", "1")
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getIraq", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.country", "1")
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getForReport", (req, res) => {
  db.raw(`
    SELECT
      tbl_employees.emp_id as emp_id,
      tbl_employees.first_name as first_name,
      tbl_employees.last_name as last_name,
      tbl_employees.st_id as st_id,
      tbl_employees.cabina_id as cabina_id,
      tbl_staffs.staff_name as staff_name,
      tbl_staffs.special_staff as special_staff,
      tbl_employees.phone as phone,
      tbl_employees.reg_date as reg_date,
      tbl_employees.salary_type,
      tbl_employees.active_status as active_status,
      tbl_employees.birth_date as birth_date,
      tbl_employees.monthly_salary as monthly_salary,
      tbl_employees.daily_salary as daily_salary,
      tbl_employees.hour_salary as hour_salary,
      tbl_employees.identification_image_path as identification_image_path,
      tbl_employees.personal_image_path as personal_image_path,
      tbl_employees.country as country,
      tbl_employees.food_money as food_money,
      tbl_employees.transport_money as transport_money,
      tbl_employees.cabina_money as cabina_money,
      tbl_employees.guarantee as guarantee,
      tbl_employees.expense_money as expense_money,
      tbl_employees.fine_money as fine_money,
      tbl_employees.loan_money as loan_money,
      tbl_employees.accomodation_money as accomodation_money,
      tbl_employees.other_expense as other_expense,
      tbl_employees.other_minus as other_minus,
      tbl_employees.expiry_passport as expiry_passport,
      tbl_employees.expire_accomodation as expire_accomodation,
      tbl_employees.asaish_code as asaish_code,
      tbl_employees.phone2 as phone2,
      tbl_employees.car as car,
      tbl_employees.car_number as car_number,
      tbl_employees.living_location as living_location,
      tbl_employees.first_work_date as first_work_date,
      tbl_employees.job as job,
      tbl_employees.city as city,
      tbl_employees.passport_number as passport_number,
      tbl_employees.accomodation_number as accomodation_number,
      tbl_employees.blood_group as blood_group,
      tbl_employees.family_number_1 as family_number_1,
      tbl_employees.family_number_2 as family_number_2,
      tbl_employees.certificate as certificate,
      tbl_employees.office as office,
      tbl_employees.language as language,
      tbl_employees.electricity_works as electricity_works,
      tbl_employees.other_works as other_works,
      tbl_employees.skill as skill,
      tbl_employees.religion as religion,
      tbl_employees.religion_type as religion_type
    FROM tbl_employees
    JOIN tbl_staffs ON tbl_staffs.st_id = tbl_employees.st_id
    WHERE 
      tbl_employees.active_status = '${req.query.active_status.toString()}' 
      AND tbl_staffs.show_staff = '1' 
      AND tbl_employees.st_id ${req.query.st_id ? "=" : "<>"} ${req.query.st_id || "0"}
      ${req.query.en_id ? ` AND tbl_staffs.en_id =  ${req.query.en_id}` : ''}
    ORDER BY tbl_staffs.staff_sort_code ASC, tbl_employees.sort_code ASC
  `).then(([data]) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post('/saveSortOffice', async (req, res) => {
  const list = req.body.list
  for(let i = 0; i < list.length; i++) {
      await db('tbl_employees').where('emp_id', list[i].emp_id).update({
          office_sort_code: i
      })
  }

  return res.sendStatus(200);
})

router.post("/getForeign", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.country", "2")
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getDeactived", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.active_status", "0")
    .orderBy("tbl_employees.emp_id", "desc")
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getNames/:st_id", (req, res) => {
  db("tbl_employees").where("st_id", req.params.st_id).andWhere("active_status", "1").andWhereRaw(
    "emp_id not in (select emp_id from tbl_attendance where dsl_id in (select dsl_id from tbl_daily_staff_list where work_date = ?))",
    [req.body.work_date]
  ).select([
    "emp_id as emp_id",
    db.raw("concat(first_name, ' ', last_name) as full_name")
  ]).then((data) => {
    return res.status(200).send(data);
  });
});

router.post("/getNoOfEmployees", async (req, res) => {
  const [{ noOfEmployees }] = await db("tbl_employees").count("* as noOfEmployees");
  return res.status(200).json({
    noOfEmployees
  });
});

router.post("/searchEmployee", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.emp_id", "=", req.body.search_value)
    .orWhere("tbl_employees.first_name", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.last_name", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_staffs.staff_name", "like", ('%' + req.body.search_value + '%'))
    // .orWhere("tbl_employees.phone", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.reg_date", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.salary_type", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.birth_date", "like", ('%' + req.body.search_value + '%'))
    .orderBy("tbl_employees.emp_id", "desc").then((data) => {
      return res.status(200).send(data);
    })
});

router.post("/searchByID", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
    "tbl_employees.cabina_id as cabina_id",
    "tbl_staffs.staff_name as staff_name",
    "tbl_employees.phone as phone",
    "tbl_employees.reg_date as reg_date",
    "tbl_employees.salary_type",
    "tbl_employees.active_status as active_status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path",
    "tbl_employees.country as country",
    "tbl_employees.food_money as food_money",
    "tbl_employees.transport_money as transport_money",
    "tbl_employees.cabina_money as cabina_money",
    "tbl_employees.guarantee as guarantee",
    "tbl_employees.expense_money as expense_money",
    "tbl_employees.fine_money as fine_money",
    "tbl_employees.loan_money as loan_money",
    "tbl_employees.accomodation_money as accomodation_money",
    "tbl_employees.other_expense as other_expense",
    "tbl_employees.other_minus as other_minus",
    "tbl_employees.expiry_passport as expiry_passport",
    "tbl_employees.expire_accomodation as expire_accomodation",
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date",
    "tbl_employees.job as job",
    "tbl_employees.city as city",
    "tbl_employees.passport_number as passport_number",
    "tbl_employees.accomodation_number as accomodation_number",
    "tbl_employees.blood_group as blood_group",
    "tbl_employees.family_number_1 as family_number_1",
    "tbl_employees.family_number_2 as family_number_2",
    "tbl_employees.certificate as certificate",
    "tbl_employees.office as office",
    "tbl_employees.language as language",
    "tbl_employees.electricity_works as electricity_works",
    "tbl_employees.other_works as other_works",
    "tbl_employees.skill as skill",
    "tbl_employees.religion as religion",
    "tbl_employees.religion_type as religion_type",
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.emp_id", "=", req.body.search_value).then((data) => {
      return res.status(200).send(data);
    })
});

router.post('/getEmployeeInfo/:id/:month/:year', async (req,res)=>{
  var [gived_salary]  = await db("tbl_gived_salary")
    .where("salary_month", req.params.month)
    .andWhere("salary_year", req.params.year)
    .andWhereRaw("emp_id = ?", [req.params.id])
    .select([
      "gs_id",
      "monthly_salary",
      "daily_salary",
      "hour_salary",
      "food_money",
      "transport_money",
      "cabina_money",
      "expense_money",
      "fine_money",
      "loan_money",
      "accomodation_money",
      "other_expense",
      "other_minus",
    ]).limit(1);
  const gs_id = (typeof gived_salary == "undefined" ? null: gived_salary.gs_id);
  const [[employee]] = await db.raw('select * from employee_final_with_give_salary where emp_id=? and date_to_m=? and date_to_y=? limit 1', [req.params.id,req.params.month,req.params.year])
  const [each_days] = await db.raw('select * from employee_month_info_each_days where emp_id=? and date_to_m=? and date_to_y=?', [req.params.id,req.params.month,req.params.year])
  const [each_give_salary] = await db.raw("select * from tbl_gived_salary_detail where gs_id = ?", [gs_id]);
  return res.status(200).json({
    gs_id,
    gived_salary: gived_salary || {},
    employee,
    each_days,
    each_give_salary: each_give_salary || []
  });
});

router.post('/topOvertime/:month/:year', async (req, res)=>{
  const [overtimeData] = await db.raw(`
    SELECT
      tbl_attendance.st_id,
      tbl_staffs.staff_name,
      tbl_attendance.emp_id,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name,
      tbl_attendance.work_project_id,
      work_projects.work_project_name,
      SUM(tbl_attendance.overtime) AS total_overtime
    FROM tbl_attendance
    INNER JOIN tbl_employees ON (tbl_attendance.emp_id = tbl_employees.emp_id)
    INNER JOIN tbl_staffs ON (tbl_attendance.st_id = tbl_staffs.st_id)
    INNER JOIN tbl_daily_staff_list ON (tbl_attendance.dsl_id = tbl_daily_staff_list.dsl_id)
    LEFT JOIN work_projects ON (tbl_attendance.work_project_id = work_projects.work_project_id)
    WHERE MONTH(tbl_daily_staff_list.work_date) = ${req.params.month} 
      AND YEAR(tbl_daily_staff_list.work_date) = ${req.params.year}
      AND tbl_attendance.overtime > 0
      ${req.body.st_id ? ` AND tbl_attendance.st_id = ${req.body.st_id}` : ''}
    GROUP BY 
      tbl_attendance.st_id, 
      tbl_staffs.staff_name,
      tbl_attendance.emp_id, 
      tbl_employees.first_name, 
      tbl_employees.last_name,
      tbl_attendance.work_project_id,
      work_projects.work_project_name
    ORDER BY tbl_staffs.staff_sort_code ASC, tbl_employees.sort_code ASC, work_projects.work_project_name ASC
  `);

  // Group data by staff -> employee -> work project
  const uniqueStaffs = Array.from(new Set(overtimeData.map(item => item.st_id)));

  const groupedByStaff = uniqueStaffs.map(st_id => {
    const staffData = overtimeData.filter(r => r.st_id === st_id);
    const uniqueEmployees = Array.from(new Set(staffData.map(item => item.emp_id)));

    const employees = uniqueEmployees.map(emp_id => {
      const employeeData = staffData.filter(r => r.emp_id === emp_id);
      const workProjects = employeeData.map(project => ({
        work_project_id: project.work_project_id,
        work_project_name: project.work_project_name || 'No Project',
        total_overtime: parseFloat(project.total_overtime) || 0
      }));

      return {
        emp_id,
        full_name: employeeData[0].full_name,
        work_projects: workProjects,
        employee_total_overtime: workProjects.reduce((sum, wp) => sum + wp.total_overtime, 0)
      };
    });

    return {
      st_id,
      staff_name: staffData[0].staff_name,
      employees,
      staff_total_overtime: employees.reduce((sum, emp) => sum + emp.employee_total_overtime, 0)
    };
  });

  return res.status(200).json({
    rows: groupedByStaff,
    month: req.params.month,
    year: req.params.year
  });
})

router.post('/getEmployeeBystaff/:st_id/:month/:year',(req,res)=>{
  // db.raw(`select 
  //   tbl_employees.emp_id as emp_id, 
  //   CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , 
  //   tbl_employees.phone as phone, 
  //   tbl_employees.salary_type 
  //   from tbl_employees where st_id=? and active_status = '1'`,[req.params.st_id]).then(([data])=>{
  //   return res.status(200).send(data);
  // }).catch((err)=>{
  //   return res.status(500).json({
  //     message: err
  //   });
  // });
  db.raw(`
  select 
    tbl_employees.emp_id as emp_id, 
    CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , 
    tbl_employees.phone as phone, 
    tbl_employees.salary_type 
    from tbl_employees where tbl_employees.emp_id in (
      select emp_id from tbl_attendance where dsl_id in (
          select dsl_id from tbl_daily_staff_list where MONTH(work_date) = ${req.params.month} and year(work_date) = ${req.params.year}
        ) and old_st_id = ${req.params.st_id}
    )
        ORDER BY tbl_employees.sort_code ASC
  `).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
});

router.post('/getEmployeeBystaffForLoan/:st_id',(req,res)=>{
  db.raw(`select 
    tbl_employees.emp_id as emp_id, 
    CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , 
    tbl_employees.phone as phone, 
    tbl_employees.country as country, 
    tbl_employees.active_status as active_status, 
    tbl_employees.salary_type 
    from tbl_employees where st_id=? ORDER BY sort_code ASC`,[req.params.st_id]).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
  
});

router.post('/getAllEmployeeBystaff/:st_id',(req,res)=>{
  db.raw("select tbl_employees.emp_id as emp_id, CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , tbl_employees.phone as phone, tbl_employees.active_status as active_status, tbl_employees.sort_code as sort_code from tbl_employees where st_id=?",[req.params.st_id]).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
});

router.post('/getDeactivedEmployeeBystaff/:st_id',(req,res)=>{
  db.raw("select CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , tbl_employees.phone as phone, tbl_employees.emp_id as emp_id, tbl_employees.sort_code as sort_code from tbl_employees where st_id=? and active_status = '0'",[req.params.st_id]).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
});

router.get('/getEmployeeMonthDetail/:month/:year/:emp_id', async (req, res) => {
  const rows = await db.raw(`
    SELECT
      tbl_employees.emp_id,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name,
      tbl_daily_staff_list.dsl_id,
      tbl_daily_staff_list.work_date,
      tbl_attendance.fine,
      tbl_attendance.fine_reason,
      tbl_attendance.food,
      tbl_attendance.food_reason,
      tbl_attendance.expense,
      tbl_attendance.expense_reason,
      tbl_attendance.transport,
      tbl_attendance.transport_reason,
      tbl_attendance.loan,
      tbl_attendance.loan_reason,
      tbl_attendance.accomodation,
      tbl_attendance.accomodation_reason
        FROM tbl_attendance
        INNER JOIN tbl_employees ON tbl_attendance.emp_id = tbl_employees.emp_id
        INNER JOIN tbl_daily_staff_list ON tbl_attendance.dsl_id = tbl_daily_staff_list.dsl_id
      WHERE tbl_attendance.dsl_id IN (
        SELECT dsl_id FROM tbl_daily_staff_list WHERE MONTH(work_date) = ${req.params.month} AND YEAR(work_date) = ${req.params.year}
      ) AND tbl_attendance.emp_id = ${req.params.emp_id}
      ORDER BY tbl_daily_staff_list.work_date ASC

  `).then((data) => {
    return data[0]
  })
  return res.status(200).send(rows);
})

router.get('/getDetailedMonthDetail/:month/:year/:type', async (req, res) => {
  if(!['transport', 'fine', 'loan', 'expense', 'accomodation', 'food'].includes(req.params.type) || !req.params.month || !req.params.year) {
    return res.status(400).send({ message: 'Invalid type parameter' });
  }
  const staffs = await db.raw(`
    SELECT 
      tbl_attendance.st_id,
      tbl_staffs.staff_name,
      SUM(tbl_attendance.${req.params.type}) AS total
    FROM tbl_attendance
    INNER JOIN tbl_staffs ON (tbl_attendance.st_id = tbl_staffs.st_id)
    WHERE tbl_attendance.dsl_id IN (
      SELECT dsl_id FROM tbl_daily_staff_list WHERE MONTH(work_date) = ${req.params.month} AND YEAR(work_date) = ${req.params.year}
    ) AND tbl_attendance.${req.params.type} > 0
      AND NOT EXISTS (
        SELECT 1 FROM salary_list_to_null WHERE salary_list_to_null.st_id = tbl_attendance.st_id AND salary_list_to_null.month = ${req.params.month} AND salary_list_to_null.year = ${req.params.year} AND tbl_attendance.emp_id = salary_list_to_null.emp_id
      )
    GROUP BY tbl_attendance.st_id
    ORDER BY tbl_staffs.staff_sort_code ASC
  `).then((data) => {
    return data[0]
  })

  const all_employees = await db.raw(`
    SELECT
      tbl_employees.emp_id,
      tbl_attendance.st_id,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name,
      tbl_daily_staff_list.dsl_id,
      SUM(tbl_attendance.${req.params.type}) AS total
    FROM tbl_attendance
    INNER JOIN tbl_employees ON (tbl_attendance.emp_id = tbl_employees.emp_id)
    INNER JOIN tbl_daily_staff_list ON (tbl_attendance.dsl_id = tbl_daily_staff_list.dsl_id)
    WHERE tbl_attendance.dsl_id IN (
      SELECT dsl_id FROM tbl_daily_staff_list WHERE MONTH(work_date) = ${req.params.month} AND YEAR(work_date) = ${req.params.year}
    ) AND tbl_attendance.${req.params.type} > 0
     AND NOT EXISTS (
      SELECT 1 FROM salary_list_to_null WHERE salary_list_to_null.emp_id = tbl_attendance.emp_id AND salary_list_to_null.month = ${req.params.month} AND salary_list_to_null.year = ${req.params.year} AND salary_list_to_null.st_id = tbl_attendance.st_id
     )
    GROUP BY tbl_attendance.emp_id
    ORDER BY tbl_employees.sort_code ASC
  `).then((data) => {
    return data[0]
  })

  const all_employee_detail = await db.raw(`
    SELECT
      tbl_employees.emp_id,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name,
      tbl_daily_staff_list.dsl_id,
      tbl_daily_staff_list.work_date,
      tbl_attendance.fine,
      tbl_attendance.fine_reason,
      tbl_attendance.food,
      tbl_attendance.food_reason,
      tbl_attendance.expense,
      tbl_attendance.expense_reason,
      tbl_attendance.transport,
      tbl_attendance.transport_reason,
      tbl_attendance.loan,
      tbl_attendance.loan_reason,
      tbl_attendance.accomodation,
      tbl_attendance.accomodation_reason
        FROM tbl_attendance
        INNER JOIN tbl_employees ON tbl_attendance.emp_id = tbl_employees.emp_id
        INNER JOIN tbl_daily_staff_list ON tbl_attendance.dsl_id = tbl_daily_staff_list.dsl_id
      WHERE tbl_attendance.dsl_id IN (
        SELECT dsl_id FROM tbl_daily_staff_list WHERE MONTH(work_date) = ${req.params.month} AND YEAR(work_date) = ${req.params.year}
      ) AND tbl_attendance.${req.params.type} > 0
        AND NOT EXISTS (
          SELECT 1 FROM salary_list_to_null WHERE salary_list_to_null.emp_id = tbl_attendance.emp_id AND salary_list_to_null.month = ${req.params.month} AND salary_list_to_null.year = ${req.params.year} AND salary_list_to_null.st_id = tbl_attendance.st_id
        )
      ORDER BY tbl_daily_staff_list.work_date ASC

  `).then((data) => {
    return data[0]
  })

  return res.status(200).send({
    staffs,
    all_employees,
    all_employee_detail
  })
})

router.get('/getEmployeeByEngineer/:en_id', (req, res) => {
  db.raw(`
    SELECT 
      tbl_employees.emp_id,
      tbl_employees.first_name,
      tbl_employees.last_name,
      tbl_staffs.staff_name,
      tbl_employees.phone,
      tbl_employees.phone2,
      tbl_employees.active_status,
      tbl_employees.salary_type
    FROM tbl_employees
    INNER JOIN tbl_staffs ON tbl_employees.st_id = tbl_staffs.st_id
    WHERE tbl_employees.st_id IN (
      SELECT st_id FROM tbl_staffs WHERE en_id = ${req.params.en_id}
    )
  `).then(([data]) => {
    return res.status(200).send(data)
  }).catch((err) => {
    return res.status(500).json({
      message: err
    });
  }); 

})

router.get('/getById/:emp_id', (req, res) => {
  db('tbl_employees').where('emp_id', req.params.emp_id).select().first().then((data) => {
    return res.status(200).send({
      data
    })
  });
});


// Debt Routes

router.post('/addDebtTransaction', async (req, res) => {
  const [dtID] = await db('tbl_debt_transactions').insert({
    emp_id: req.body.emp_id,
    transactionAmount: req.body.transactionType == 'Minus' ? req.body.transactionAmount * -1 : req.body.transactionAmount,
    transactionType: req.body.transactionType,
    transactionDate: db.fn.now(),
    note: req.body.note || null
  });
  return res.status(200).send({dtID});
});

router.patch('/updateDebtTransaction/:dtID', async (req, res) => {
  try {
    await db('tbl_debt_transactions').where('dtID', req.params.dtID).update({
      transactionAmount: req.body.transactionType == 'Minus' ? req.body.transactionAmount * -1 : req.body.transactionAmount,
      transactionType: req.body.transactionType,
      note: req.body.note || null
    });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/deleteDebtTransaction/:dtID', async (req, res) => {
  try {
    await db('tbl_debt_transactions').where('dtID', req.params.dtID).delete();
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/getEmployeeTransaction/:emp_id', async (req, res) => {
  const transactions = await db('tbl_debt_transactions').where('emp_id', req.params.emp_id).select().orderBy('dtID', 'desc');
  return res.status(200).send(transactions);
});

router.post('/getSalaryListByMonthAndYear', async (req, res) => {
  const [salary_list] = await db.raw(`
  SELECT
      tbl_employees.emp_id,
      concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as employee_full_name,
      tbl_employees.job,
      tbl_employees.country,
      tbl_employees.sort_code,
      tbl_employees.office,
      employee_final_with_give_salary.salary_type,
      employee_final_with_give_salary.monthly_salary,
      employee_final_with_give_salary.daily_salary,
      tbl_employees.hour_salary,
      employee_final_with_give_salary.date_to_m,
      employee_final_with_give_salary.date_to_y,
      tbl_employees.st_id,
      employee_final_with_give_salary.count_present,
      employee_final_with_give_salary.total_o,
      employee_final_with_give_salary.total_fine,
      employee_final_with_give_salary.total_expense,
      employee_final_with_give_salary.total_transport,
      employee_final_with_give_salary.total_food,
      employee_final_with_give_salary.total_loan,
      employee_final_with_give_salary.total_accomodation,
      employee_final_with_give_salary.loan_by_accomodation,
      employee_final_with_give_salary.accomodation_by_accomodation,
      employee_final_with_give_salary.expense_by_accomodation,
      employee_final_with_give_salary.fine_by_accomodation,
      employee_final_with_give_salary.total_f,
      employee_final_with_give_salary.total_h_not_work,
      (employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) as total_hour,
      employee_final_with_give_salary.total_o_s,
      employee_final_with_give_salary.food_money,
      employee_final_with_give_salary.transport_money,
      employee_final_with_give_salary.cabina_money,
      employee_final_with_give_salary.guarantee,
      employee_final_with_give_salary.expense_money,
      employee_final_with_give_salary.fine_money,
      employee_final_with_give_salary.loan_money,
      employee_final_with_give_salary.accomodation_money,
      employee_final_with_give_salary.other_expense,
      employee_final_with_give_salary.other_minus,
      employee_final_with_give_salary.added_days,
      employee_final_with_give_salary.added_overtime,
      employee_final_with_give_salary.gs_id
      from tbl_employees 
      JOIN employee_final_with_give_salary ON (tbl_employees.emp_id = employee_final_with_give_salary.emp_id)
      WHERE employee_final_with_give_salary.emp_id IN (
        select emp_id from tbl_attendance where dsl_id in (
          select dsl_id from tbl_daily_staff_list where MONTH(work_date) = ${req.body.month} and year(work_date) = ${req.body.year}
        ) and old_st_id = ${req.body.staff_id}
      ) AND employee_final_with_give_salary.date_to_m = ${req.body.month} AND employee_final_with_give_salary.date_to_y = ${req.body.year} 
  `);

  const acs_number = await db('acs_numbers').where('st_id', req.body.staff_id).andWhere('month', req.body.month).andWhere('year', req.body.year).select().first()

  // Get distinct work_project_ids from attendance table for the specified month, year, and staff
  // Exclude employees that are on the zeros list
  const [work_projects] = await db.raw(`
    SELECT DISTINCT 
      tbl_attendance.work_project_id,
      work_projects.work_project_name
    FROM tbl_attendance
    LEFT JOIN work_projects ON (tbl_attendance.work_project_id = work_projects.work_project_id)
    WHERE tbl_attendance.dsl_id IN (
      SELECT dsl_id FROM tbl_daily_staff_list 
      WHERE MONTH(work_date) = ${req.body.month} AND YEAR(work_date) = ${req.body.year}
    ) AND tbl_attendance.old_st_id = ${req.body.staff_id}
    AND tbl_attendance.work_project_id IS NOT NULL
    AND tbl_attendance.emp_id NOT IN (
      SELECT emp_id FROM salary_list_to_null 
      WHERE month = ${req.body.month} AND year = ${req.body.year} AND st_id = ${req.body.staff_id}
    )
    ORDER BY work_projects.work_project_name ASC
  `);

  const [zeros] = await db.raw(`
    SELECT emp_id FROM salary_list_to_null WHERE month = ${req.body.month} AND year = ${req.body.year} AND st_id = ${req.body.staff_id}
  `)

  const [astopaki] = await db.raw(`
    SELECT * FROM astopaki WHERE st_id = ? AND month = ? AND YEAR = ?
  `, [req.body.staff_id, req.body.month, req.body.year])

  return res.status(200).send({
    salary_list,
    work_projects,
    zeros,
    astopaki,
    acs_number
  });
})

router.post('/addAstopaki', (req, res) => {
  db('astopaki').insert({
    emp_id: req.body.emp_id,
    st_id: req.body.st_id,
    month: req.body.month,
    year: req.body.year
  }).then(() => {
    return res.sendStatus(200)
  }).catch((err) => {
    return res.status(500).send(err)
  })
})

router.delete('/deleteAstopaki/:emp_id/:st_id/:month/:year', (req, res) => {
  const {emp_id, st_id, month, year} = req.params
  db.raw(`DELETE FROM astopaki WHERE emp_id = ? AND st_id = ? AND month = ? AND YEAR = ?`, [emp_id, st_id, month, year]).then(() => {
    return res.sendStatus(200)
  }).catch(e => {
    return res.status(500).send(e)
  })
})

router.post('/getOfficeSalary', async (req, res) => {
  const [salary_list] = await db.raw(`
  SELECT
      tbl_employees.emp_id,
      concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as employee_full_name,
      tbl_employees.job,
      tbl_employees.country,
      tbl_employees.sort_code,
      employee_final_with_give_salary.salary_type,
      employee_final_with_give_salary.monthly_salary,
      employee_final_with_give_salary.daily_salary,
      tbl_employees.hour_salary,
      tbl_employees.office_sort_code,
      employee_final_with_give_salary.date_to_m,
      employee_final_with_give_salary.date_to_y,
      tbl_employees.st_id,
      employee_final_with_give_salary.count_present,
      employee_final_with_give_salary.total_o,
      employee_final_with_give_salary.total_fine,
      employee_final_with_give_salary.total_expense,
      employee_final_with_give_salary.total_transport,
      employee_final_with_give_salary.total_food,
      employee_final_with_give_salary.total_loan,
      employee_final_with_give_salary.total_accomodation,
      employee_final_with_give_salary.loan_by_accomodation,
      employee_final_with_give_salary.accomodation_by_accomodation,
      employee_final_with_give_salary.expense_by_accomodation,
      employee_final_with_give_salary.fine_by_accomodation,
      employee_final_with_give_salary.total_f,
      employee_final_with_give_salary.total_h_not_work,
      (employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) as total_hour,
      employee_final_with_give_salary.total_o_s,
      employee_final_with_give_salary.food_money,
      employee_final_with_give_salary.transport_money,
      employee_final_with_give_salary.cabina_money,
      employee_final_with_give_salary.guarantee,
      employee_final_with_give_salary.expense_money,
      employee_final_with_give_salary.fine_money,
      employee_final_with_give_salary.loan_money,
      employee_final_with_give_salary.accomodation_money,
      employee_final_with_give_salary.other_expense,
      employee_final_with_give_salary.other_minus,
      employee_final_with_give_salary.added_days,
      employee_final_with_give_salary.added_overtime,
      employee_final_with_give_salary.gs_id
      from tbl_employees 
      JOIN employee_final_with_give_salary ON (tbl_employees.emp_id = employee_final_with_give_salary.emp_id)
      WHERE tbl_employees.office = 'true' AND employee_final_with_give_salary.date_to_m = ${req.body.month} AND employee_final_with_give_salary.date_to_y = ${req.body.year} 
  `);
  const [zeros] = await db.raw(`
    SELECT emp_id FROM salary_list_to_null WHERE month = ${req.body.month} AND year = ${req.body.year}
  `)

  const [astopaki] = await db.raw(`
    SELECT * FROM astopaki  WHERE month = ? AND YEAR = ?
  `, [ req.body.month, req.body.year])

  return res.status(200).send({
    salary_list,
    zeros: [],
    astopaki
  });
})

router.post('/saveNoteZeroList/:month/:year/:st_id/:emp_id', async (req, res) => {
  try {
    await db('salary_list_to_null').where('month', req.params.month).andWhere('year', req.params.year).andWhere('st_id', req.params.st_id).andWhere('emp_id', req.params.emp_id).update({
      note: req.body.note
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
})

router.post('/getZerosByMonthAndYear', async (req, res) => {
  let query = ""
  let arrQuery = []
  if(req.body.staff_id) {
    query = ` AND salary_list_to_null.st_id = ?`
    arrQuery.push(req.body.staff_id)
  }
  const [zeros] = await db.raw(`
    SELECT 
      salary_list_to_null.*,
      CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name
      FROM salary_list_to_null 
      JOIN tbl_employees ON (tbl_employees.emp_id = salary_list_to_null.emp_id)
      WHERE salary_list_to_null.month = ? AND salary_list_to_null.year = ? ${query}
  `, [req.body.month, req.body.year, ...arrQuery])
  
  return res.status(200).send(zeros);
})

router.post('/getSalaryListByMonthAndYearForTotal', async (req, res) => {
  const special = req.body.special == 'normals' ? 'false' : 'true'

  const staffs = await db('tbl_staffs').where('show_staff', '1').andWhere('special_staff', special).select();
  const salary_list = [];
  const zeros = [];
  const promises = staffs.map(async (staff) => {
    let [staff_salary] = await db.raw(`
    SELECT
        tbl_employees.emp_id,
        concat(tbl_employees.first_name, ' ', tbl_employees.last_name) as employee_full_name,
        employee_final_with_give_salary.salary_type,
        employee_final_with_give_salary.monthly_salary,
        employee_final_with_give_salary.daily_salary,
        tbl_employees.hour_salary,
        employee_final_with_give_salary.date_to_m,
        employee_final_with_give_salary.date_to_y,
        tbl_employees.st_id,
        tbl_employees.sort_code,
        (employee_final_with_give_salary.count_present + employee_final_with_give_salary.added_days) as count_present,
        employee_final_with_give_salary.total_o,
        employee_final_with_give_salary.total_fine,
        employee_final_with_give_salary.total_expense,
        employee_final_with_give_salary.total_transport,
        employee_final_with_give_salary.total_food,
        employee_final_with_give_salary.total_loan,
        employee_final_with_give_salary.total_accomodation,
        employee_final_with_give_salary.loan_by_accomodation,
        employee_final_with_give_salary.accomodation_by_accomodation,
        employee_final_with_give_salary.expense_by_accomodation,
        employee_final_with_give_salary.fine_by_accomodation,
        employee_final_with_give_salary.total_f,
        employee_final_with_give_salary.total_h_not_work,
        ((employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) + employee_final_with_give_salary.added_overtime) as total_hour,
        employee_final_with_give_salary.total_o_s,
        employee_final_with_give_salary.food_money,
        employee_final_with_give_salary.transport_money,
        employee_final_with_give_salary.cabina_money,
        employee_final_with_give_salary.guarantee,
        employee_final_with_give_salary.expense_money,
        employee_final_with_give_salary.fine_money,
        employee_final_with_give_salary.loan_money,
        employee_final_with_give_salary.accomodation_money,
        employee_final_with_give_salary.other_expense,
        employee_final_with_give_salary.other_minus
        from tbl_employees 
        JOIN employee_final_with_give_salary ON (tbl_employees.emp_id = employee_final_with_give_salary.emp_id)
        WHERE employee_final_with_give_salary.emp_id IN (
          select emp_id from tbl_attendance where dsl_id in (
            select dsl_id from tbl_daily_staff_list where MONTH(work_date) = ${req.body.month} and year(work_date) = ${req.body.year}
          ) and old_st_id = ${staff.st_id}
        ) AND employee_final_with_give_salary.date_to_m = ${req.body.month} AND employee_final_with_give_salary.date_to_y = ${req.body.year} 
    `);
    salary_list.push(...staff_salary);
    let [zero_list] = await db.raw(`
      SELECT emp_id, st_id FROM salary_list_to_null WHERE month = ${req.body.month} AND year = ${req.body.year} AND st_id = ${staff.st_id}
    `)
    zeros.push(...zero_list);
  })
  await Promise.all(promises);
  return res.status(200).send({
    salary_list,
    zeros
  });
})

router.get('/getZeroList/:year/:month/:st_id', (req, res) => {
  db.raw(`
    SELECT emp_id FROM salary_list_to_null WHERE month = ${req.params.month} AND year = ${req.params.year} AND st_id = ${req.params.st_id}
  `).then(([data]) => {
    return res.status(200).send(data)
  })
})

router.post('/saveEmployeesSort', async (req, res) => {
  const list = req.body.list
  for(let i = 0; i < list.length; i++) {
    await db('tbl_employees').where('emp_id', list[i].emp_id).update({
      sort_code: i
    })
  }

  res.sendStatus(200);
})

router.post('/addZeroList', (req, res) => {
  db.raw(`
    SELECT emp_id FROM salary_list_to_null WHERE month = ${req.body.list[0].month} AND year = ${req.body.list[0].year} AND st_id = ${req.body.list[0].st_id} AND emp_id = ${req.body.list[0].emp_id}
  `).then(([data]) => {
    if(data.length == 0) {
      db('salary_list_to_null').insert(req.body.list).then(() => {
        return res.sendStatus(200);
      })
    } else {
      return res.sendStatus(200);
    }
  })
  
})

router.delete('/deleteZeroList/:year/:month/:st_id/:emp_id', (req, res) => {
  db('salary_list_to_null').where('year', req.params.year).andWhere('month', req.params.month).andWhere('st_id', req.params.st_id).andWhere('emp_id', req.params.emp_id).delete().then(() => {
    return res.sendStatus(200);
  })
})

router.get('/personal_image/:name', (req, res) => {
  return res.sendFile(path.join(__dirname, `../employee_images/${req.params.name}`));
})

router.post('/updatePersonalImage/:emp_id', async (req, res) => {
  upload(req, res, async (err) => {
    if(err instanceof multer.MulterError) {
      return res.status(500).json({
        message: err.message
      })
    } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == 'ExtensionError') {
            res.status(400).json({
                error: {
                    message: err.message
                }
            }).end();
        } else {
            res.status(400).json({
                error: {
                    message: `unknown uploading error: ${err.message}`
                }
            }).end();
        }
        return;
    }

    let personal_image_path = null;
    if(req.file) {
      personal_image_path = req.file.filename
    }

    const old_data = await db('tbl_employees').where('emp_id', req.params.emp_id).select('personal_image_path').first()

    db('tbl_employees').where('emp_id', req.params.emp_id).update({
      personal_image_path
    }).then(() => {
      if(old_data.personal_image_path) {
        fs.unlinkSync(path.join(__dirname, `../employee_images/${old_data.personal_image_path}`))
      }
      return res.status(200).send({
        personal_image_path
      })
    })

  })
})

router.delete('/deletePersonalImage/:emp_id', async (req, res) => {
  const old_data = await db('tbl_employees').where('emp_id', req.params.emp_id).select('personal_image_path').first()

  db('tbl_employees').where('emp_id', req.params.emp_id).update({
    personal_image_path: null
  }).then(() => {
    if(old_data.personal_image_path) {
      fs.unlinkSync(path.join(__dirname, `../employee_images/${old_data.personal_image_path}`))
    }
    return res.sendStatus(200)
  })
})

router.post('/upload_documents/:emp_id', (req, res) => {
  uploadDocuments(req, res, async (err) => {
    if(err instanceof multer.MulterError) {
      return res.status(500).json({
        message: err.message
      })
    } else if (err) {
        // An unknown error occurred when uploading.
        if (err.name == 'ExtensionError') {
            res.status(400).json({
                error: {
                    message: err.message
                }
            }).end();
        } else {
            res.status(400).json({
                error: {
                    message: `unknown uploading error: ${err.message}`
                }
            }).end();
        }
        return;
    }

    const documents = await Promise.all(req.files.map(f => {
      return {
        emp_id: req.params.emp_id,
        employee_document: f.filename,
        employee_document_virtual_name: f.filename,
        document_type: ['image/png', 'image/jpg', 'image/JPG', 'image/jpeg'].includes(f.mimetype) ? 'image' : ['application/pdf'].includes(f.mimetype) ? 'pdf' : ''
      }
    }))

    await db('employee_documents').insert(documents)

    const new_documents = await db('employee_documents').where('emp_id', req.params.emp_id).select()

    return res.status(200).send(new_documents)
  })
})

router.get('/get_documents/:emp_id', async (req, res) => {
  const documents = await db('employee_documents').where('emp_id', req.params.emp_id).select()
  return res.status(200).send(documents)
})

router.get('/get_document_file/:name/:type', (req, res) => {
  fs.readFile(path.join(__dirname, `../employee_documents/${req.params.name}`), async (err, data) => {
    if(err) {
      return res.status(500).json({
        message: err.message
      })
    }

    res.setHeader('Content-Type', req.params.type == 'pdf' ? 'application/pdf' : 'image/*')

    return res.status(200).send(data)
  })
})

router.delete('/delete_document/:id', async (req, res) => {
  const document = await db('employee_documents').where('employee_document_id', req.params.id).select().first()

  fs.unlinkSync(path.join(__dirname, `../employee_documents/${document.employee_document}`))

  await db('employee_documents').where('employee_document_id', req.params.id).delete()

  return res.sendStatus(200)
})

router.patch('/edit_document_name/:id', async (req, res) => {
  await db('employee_documents').where('employee_document_id', req.params.id).update({
    employee_document_virtual_name: req.body.employee_document_virtual_name
  })

  const document = await db('employee_documents').where('employee_document_id', req.params.id).select().first()

  return res.status(200).send(document)
})

router.get('/getHistory/:emp_id', async (req, res) => {
  const history = await db('employee_history').where('emp_id', req.params.emp_id).select().orderBy('employee_history_id', 'asc')
  return res.status(200).send(history)
})

router.post('/addHistory', async (req, res) => {
  const history = await db('employee_history').insert({
    emp_id: req.body.emp_id,
    note: req.body.note || null,
    date: req.body.date || null,
  })

  return res.status(200).send({
    employee_history_id: history[0],
  })
})

router.get('/getOneHistory/:id', async (req, res) => {
  const history = await db('employee_history').where('employee_history_id', req.params.id).select().first()
  return res.status(200).send(history)
})

router.patch('/updateHistory/:id', async (req, res) => {
  await db('employee_history').where('employee_history_id', req.params.id).update({
    note: req.body.note || null,
    date: req.body.date || null,
  })


  return res.sendStatus(200)
})

router.delete('/deleteHistory/:id', async (req, res) => {
  await db('employee_history').where('employee_history_id', req.params.id).delete()
  return res.sendStatus(200)
})


module.exports = router;