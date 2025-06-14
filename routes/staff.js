const express = require("express");
const fs = require("fs");
const path = require("path")
const multer = require("multer");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

const storage = multer.diskStorage({
  destination: './staff_documents/',
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  }
})

const uploadDocuments = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const mimeType = file.mimetype
    if(['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'].includes(mimeType)) {
      return cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Invalid file type'))
    }
  }
}).array('documents', 10)

router.post("/addStaff", (req, res) => {
  db("tbl_staffs")
    .insert({
      en_id: req.body.en_id,
      staff_name: req.body.staff_name,
      show_staff: '1'
    })
    .then(async ([data]) => {

      const [[{ staff_sort_code }]] = await db.raw(`select IFNULL(max(staff_sort_code), 0) as staff_sort_code from tbl_staffs where show_staff = '1' `)
      await db('tbl_staffs').where('st_id', data).update({
        staff_sort_code: staff_sort_code + 1
      })

      return res.status(200).json({
        message: "Staff Added",
        st_id: data,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/updateStaff/:st_id", (req, res) => {
  db("tbl_staffs")
    .where("st_id", req.params.st_id)
    .update({
      en_id: req.body.en_id,
      staff_name: req.body.staff_name,
    })
    .then(() => {
      return res.status(200).json({
        message: "Staff Updated",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/showOff/:st_id", (req, res) => {
  db("tbl_staffs").where("st_id", req.params.st_id).update({
      show_staff: '0'
    }).then(() => {
      return res.status(200).json({
        message: "Staff Updated",
      });
    }).catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.patch("/showOn/:st_id", (req, res) => {
  db("tbl_staffs").where("st_id", req.params.st_id).update({
      show_staff: '1'
    }).then(() => {
      return res.status(200).json({
        message: "Staff Updated",
      });
    }).catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post('/updateSpecialStaff/:st_id', async (req, res) => {
  await db('tbl_staffs').where('st_id', req.params.st_id).update({
    special_staff: req.body.special_staff
  })

  res.sendStatus(200);
})

router.post('/saveStaffSort', async (req, res) => {
  const list = req.body.list
  for(let i = 0; i < list.length; i++) {
    await db('tbl_staffs').where('st_id', list[i].st_id).update({
      staff_sort_code: i
    })
  }

  res.sendStatus(200);
})

router.delete("/deleteStaff/:st_id", (req, res) => {
  db("tbl_staffs")
    .where("st_id", req.params.st_id)
    .delete()
    .then(() => {
      return res.status(200).json({
        message: "Staff deleted",
      });
    })
    .catch((err) => {
      if(err.errno === 1451){
        return res.status(500).json({
          message: "Cannot delete this staff, it used to employees"
        });
      }
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getData", (req, res) => {
  db("tbl_staffs")
    .select()
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err,
      });
    });
});

router.post("/getStaffsAndCabinas", async (req, res) => {
  try {
    const staffs = await db("tbl_staffs").select();
    const cabinas = await db("cabinas").select().where("cabina_status", "1")

    return res.status(200).json({
      staffs,
      cabinas
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  
  }
});

router.post("/getStaffReport", async (req, res) => {
  var staffs = [];
  var employees = [];
  if(!req.body.en_id){
    staffs = await db.select(
      "tbl_staffs.st_id as st_id",
      "tbl_staffs.staff_name as staff_name",
      db.raw("concat(tbl_engineers.first_name, ' ', tbl_engineers.last_name) as engineer")
    ).from("tbl_staffs")
     .join("tbl_engineers", "tbl_staffs.en_id", "=", "tbl_engineers.en_id");

     employees = await db("tbl_employees").select();

  } else {
    staffs = await db.select(
      "tbl_staffs.st_id as st_id",
      "tbl_staffs.staff_name as staff_name",
      db.raw("concat(tbl_engineers.first_name, ' ', tbl_engineers.last_name) as engineer")
    ).from("tbl_staffs")
     .join("tbl_engineers", "tbl_staffs.en_id", "=", "tbl_engineers.en_id")
     .where("tbl_staffs.en_id", req.body.en_id);

    employees = await db("tbl_employees").whereRaw("st_id in (select st_id from tbl_staffs where en_id=?)", [req.body.en_id]).select();
  }
  
  return res.status(200).json({
    staffs,
    employees
  });
});

router.post("/getByEngineer/:en_id", (req, res) => {
  db("tbl_staffs").where("en_id", req.params.en_id).select().then((data) => {
    return res.status(200).send(data);
  });
});

router.post('/addRemovedStaff', (req, res) => {
  db('removed_staffs_from_passport_and_accomodations').insert({
    st_id: req.body.st_id,
    removed_from: req.body.removed_from,
  }).then(() => {
    return res.sendStatus(200);
  }).catch((err) => {
    console.log(err)
    return res.status(500).json({
      message: err,
    });
  });
})

router.delete('/deleteRemovedStaff/:st_id/:removed_from', (req, res) => {
  db('removed_staffs_from_passport_and_accomodations').where('st_id', req.params.st_id).where('removed_from', req.params.removed_from).delete().then(() => {
    return res.sendStatus(200)
  }).catch((err) => {
    return res.status(500).json({
      message: err,
    })
  })
})

router.post('/upload_documents/:st_id', (req, res) => {
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
        st_id: req.params.st_id,
        staff_document: f.filename,
        staff_document_virtual_name: f.filename,
        document_type: ['image/png', 'image/jpg', 'image/JPG', 'image/jpeg'].includes(f.mimetype) ? 'image' : ['application/pdf'].includes(f.mimetype) ? 'pdf' : ''
      }
    }))

    await db('staff_documents').insert(documents)

    const new_documents = await db('staff_documents').where('st_id', req.params.st_id).select()

    return res.status(200).send(new_documents)
  })
})

router.get('/get_documents/:st_id', async (req, res) => {
  const documents = await db('staff_documents').where('st_id', req.params.st_id).select()
  return res.status(200).send(documents)
})

router.get('/get_document_file/:name/:type', (req, res) => {
  fs.readFile(path.join(__dirname, `../staff_documents/${req.params.name}`), async (err, data) => {
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
  const document = await db('staff_documents').where('sd_id', req.params.id).select().first()

  fs.unlinkSync(path.join(__dirname, `../staff_documents/${document.staff_document}`))

  await db('staff_documents').where('sd_id', req.params.id).delete()

  return res.sendStatus(200)
})

router.patch('/edit_document_name/:id', async (req, res) => {
  await db('staff_documents').where('sd_id', req.params.id).update({
    staff_document_virtual_name: req.body.staff_document_virtual_name
  })

  const document = await db('staff_documents').where('sd_id', req.params.id).select().first()

  return res.status(200).send(document)
})

module.exports = router;