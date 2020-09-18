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
      active_status:"1"
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
    "tbl_employees.active_status as status",
    "tbl_employees.birth_date as birth_date",
    "tbl_employees.monthly_salary as monthly_salary",
    "tbl_employees.daily_salary as daily_salary",
    "tbl_employees.hour_salary as hour_salary",
    "tbl_employees.identification_image_path as identification_image_path",
    "tbl_employees.personal_image_path as personal_image_path"
  )
    .from("tbl_employees")
    .join("tbl_staffs", "tbl_staffs.st_id", "=", "tbl_employees.st_id")
    .offset(req.body.offset)
    .limit(15)
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getNoOfEmployees", async (req, res) => {
  const [{ noOfEmployees }] = await db("tbl_employees").count("* as noOfEmployees");
  return res.status(200).json({
    noOfEmployees
  });
});

module.exports = router;
module.exports = router;
