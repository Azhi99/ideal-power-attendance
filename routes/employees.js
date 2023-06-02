const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const db = require("../DB/mainDBconfig.js");
const {
  createValidation,
  updateValidation,
  checkID,
} = require("../validators/employees.js");

const router = express.Router();
router.use(fileUpload());

router.post("/addEmployee", createValidation, (req, res) => {
  var personal_image_path = null;
  var identification_image_path = null;
  if (req.files && req.files.personal_image != null) {
    var image_name = req.files.personal_image.name;
    const ext = image_name.substring(image_name.lastIndexOf(".") + 1);
    if (["jpg", "jpeg", "png"].includes(ext.toLowerCase())) {
      req.files.personal_image.name = new Date().getTime() + "." + ext;
      image_name = req.files.personal_image.name;
      personal_image_path = "./employee_images/" + image_name;
    } else {
      return res.status(500).json({
        message: "Invalid image type",
      });
    }
  }
  if (req.files && req.files.identification_image != null) {
    var image_name = req.files.identification_image.name;
    const ext = image_name.substring(image_name.lastIndexOf(".") + 1);
    if (["jpg", "jpeg", "png"].includes(ext.toLowerCase())) {
      req.files.identification_image.name = new Date().getTime() + "." + ext;
      image_name = req.files.identification_image.name;
      identification_image_path = "./employee_id_images/" + image_name;
    } else {
      return res.status(500).json({
        message: "Invalid image type",
      });
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
      identification_image_path,
      personal_image_path,
      active_status:"1",
      country: req.body.country,
      food_money: req.body.food_money,
      transport_money: req.body.transport_money,
      cabina_money: req.body.cabina_money,
      expense_money: req.body.expense_money,
      fine_money: req.body.fine_money,
      loan_money: req.body.loan_money,
      accomodation_money: req.body.accomodation_money,
      other_expense: req.body.other_expense,
      other_minus: req.body.other_minus,
      expiry_passport: req.body.expiry_passport || null,
      asaish_code: req.body.asaish_code || null,
      phone2: req.body.phone2 || null,
      car: req.body.car || null,
      car_number: req.body.car_number || null,
      living_location: req.body.living_location || null,
      first_work_date: req.body.first_work_date || null,
    })
    .then(([data]) => {
      if (personal_image_path != null) {
        req.files.personal_image.mv("./public/employee_images/" + req.files.personal_image.name, function (err) {
            if (err) {
              db("tbl_employees")
                .where("emp_id", data)
                .delete()
                .then(() => {
                  return res.status(500).json({
                    message: err,
                  });
                });
            }
          }
        );
      }
      if (identification_image_path != null) {
        req.files.identification_image.mv("./public/employee_id_images/" + req.files.identification_image.name, function (err) {
            if (err) {
              db("tbl_employees")
                .where("emp_id", data)
                .delete()
                .then(() => {
                  return res.status(500).json({
                    message: err,
                  });
                });
            }
          }
        );
      }
      return res.status(200).json({
        message: "Employee Added",
        emp_id: data,
        identification_image_path,
        personal_image_path,
      });
    })
    .catch((err) => {
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
          phone: req.body.phone,
          birth_date: req.body.birth_date,
          salary_type: req.body.salary_type,
          monthly_salary: req.body.monthly_salary,
          daily_salary: req.body.daily_salary,
          hour_salary: req.body.hour_salary,
          country: req.body.country,
          food_money: req.body.food_money,
          transport_money: req.body.transport_money,
          cabina_money: req.body.cabina_money,
          expense_money: req.body.expense_money,
          fine_money: req.body.fine_money,
          loan_money: req.body.loan_money,
          accomodation_money: req.body.accomodation_money,
          other_expense: req.body.other_expense,
          other_minus: req.body.other_minus,
          expiry_passport: req.body.expiry_passport || null,
          asaish_code: req.body.asaish_code || null,
          phone2: req.body.phone2 || null,
          car: req.body.car || null,
          car_number: req.body.car_number || null,
          living_location: req.body.living_location || null,
          first_work_date: req.body.first_work_date || null,
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

router.patch("/updatePersonalImage/:emp_id", checkID, (req, res) => {
  if (req.files && req.files.personal_image != null) {
    var image_name = req.files.personal_image.name;
    const ext = image_name.substring(image_name.lastIndexOf(".") + 1);
    if (["jpeg", "jpg", "png"].includes(ext.toLowerCase())) {
      req.files.personal_image.name = new Date().getTime() + "." + ext;
      image_name = req.files.personal_image.name;
      req.files.personal_image.mv(
        "./public/employee_images/" + image_name,
        async function (err) {
          if (err) {
            return res.status(500).json({
              message: err,
            });
          }
          const [{ old_image }] = await db("tbl_employees")
            .where("emp_id", req.params.emp_id)
            .select(["personal_image_path as old_image"])
            .limit(1);
          if (old_image != null) {
            fs.unlinkSync("./public" + old_image.slice(1));
          }
          db("tbl_employees")
            .where("emp_id", req.params.emp_id)
            .update({
              personal_image_path: "./employee_images/" + image_name,
            })
            .then(() => {
              return res.status(200).json({
                message: "Personal image updated",
                personal_image_path: "./employee_images/" + image_name,
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

router.delete("/deletePersonalImage/:emp_id", checkID, (req, res) => {
  db("tbl_employees")
    .where("emp_id", req.params.emp_id)
    .select(["personal_image_path as image"])
    .limit(1)
    .then(([{ image }]) => {
      if (image != null) {
        fs.unlinkSync("./public" + image.slice(1));
      }
      db("tbl_employees")
        .where("emp_id", req.params.emp_id)
        .update({
          personal_image_path: null,
        })
        .then(() => {
          return res.status(200).json({
            message: "Personal Image deleted",
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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

router.post("/getForeign", (req, res) => {
  db.select(
    "tbl_employees.emp_id as emp_id",
    "tbl_employees.first_name as first_name",
    "tbl_employees.last_name as last_name",
    "tbl_employees.st_id as st_id",
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
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
    "tbl_employees.asaish_code as asaish_code",
    "tbl_employees.phone2 as phone2",
    "tbl_employees.car as car",
    "tbl_employees.car_number as car_number",
    "tbl_employees.living_location as living_location",
    "tbl_employees.first_work_date as first_work_date"
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .where("tbl_employees.first_name", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.last_name", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_staffs.staff_name", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.phone", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.reg_date", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.salary_type", "like", ('%' + req.body.search_value + '%'))
    .orWhere("tbl_employees.birth_date", "like", ('%' + req.body.search_value + '%'))
    .orderBy("tbl_employees.emp_id", "desc").then((data) => {
      return res.status(200).send(data);
    })
});

router.post('/getEmployeeInfo/:phone/:month/:year', async (req,res)=>{
  var [gived_salary]  = await db("tbl_gived_salary")
    .where("salary_month", req.params.month)
    .andWhere("salary_year", req.params.year)
    .andWhereRaw("emp_id = (select emp_id from tbl_employees where phone=?)", [req.params.phone])
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
  const [[employee]] = await db.raw('select * from employee_final_with_give_salary where phone=? and date_to_m=? and date_to_y=? limit 1', [req.params.phone,req.params.month,req.params.year])
  const [each_days] = await db.raw('select * from employee_month_info_each_days where phone=? and date_to_m=? and date_to_y=?', [req.params.phone,req.params.month,req.params.year])
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
 const [top_overtime] = await db.raw('select * from top_overtime where date_to_m=? and date_to_y=? order by total_o desc', [req.params.month, req.params.year])
 const [top_absent] = await db.raw('select * from top_overtime where date_to_m=? and date_to_y=? order by total_apsent desc', [req.params.month, req.params.year])
 const [top_fine] = await db.raw('select * from top_overtime where date_to_m=? and date_to_y=? order by total_f desc', [req.params.month, req.params.year])
  return res.status(200).json({
    top_overtime,
    top_absent,
    top_fine
  });
});

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
    tbl_employees.salary_type 
    from tbl_employees where st_id=? and active_status = '1'`,[req.params.st_id]).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
  
});

router.post('/getAllEmployeeBystaff/:st_id',(req,res)=>{
  db.raw("select CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , tbl_employees.phone as phone, tbl_employees.active_status as active_status from tbl_employees where st_id=?",[req.params.st_id]).then(([data])=>{
    return res.status(200).send(data);
  }).catch((err)=>{
    return res.status(500).json({
      message: err
    });
  });
});

router.post('/getDeactivedEmployeeBystaff/:st_id',(req,res)=>{
  db.raw("select CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS full_name , tbl_employees.phone as phone from tbl_employees where st_id=? and active_status = '0'",[req.params.st_id]).then(([data])=>{
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
      employee_final_with_give_salary.total_f,
      employee_final_with_give_salary.total_h_not_work,
      (employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) as total_hour,
      employee_final_with_give_salary.total_o_s,
      employee_final_with_give_salary.food_money,
      employee_final_with_give_salary.transport_money,
      employee_final_with_give_salary.cabina_money,
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
        ) and old_st_id = ${req.body.staff_id}
      ) AND employee_final_with_give_salary.date_to_m = ${req.body.month} AND employee_final_with_give_salary.date_to_y = ${req.body.year} 
  `);
  const [zeros] = await db.raw(`
    SELECT emp_id FROM salary_list_to_null WHERE month = ${req.body.month} AND year = ${req.body.year} AND st_id = ${req.body.staff_id}
  `)
  return res.status(200).send({
    salary_list,
    zeros
  });
})

router.post('/getSalaryListByMonthAndYearForTotal', async (req, res) => {
  const staffs = await db('tbl_staffs').where('show_staff', '1').select();
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
        employee_final_with_give_salary.total_f,
        employee_final_with_give_salary.total_h_not_work,
        (employee_final_with_give_salary.total_o - employee_final_with_give_salary.total_h_not_work) as total_hour,
        employee_final_with_give_salary.total_o_s,
        employee_final_with_give_salary.food_money,
        employee_final_with_give_salary.transport_money,
        employee_final_with_give_salary.cabina_money,
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

module.exports = router;