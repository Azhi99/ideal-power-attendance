const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

router.post("/getData", (req, res) => {
    db("cabinas").select("*").then((data) => {
        return res.status(200).send(data);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post("/addCabina", (req, res) => {
    db("cabinas").insert({
        cabina_name: req.body.cabina_name,
    }).then((data) => {
        return res.status(200).json({
            message: "Cabina Added",
            cabina_id: data[0]
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.patch("/updateCabina/:cabina_id", (req, res) => {
    db("cabinas").where("cabina_id", req.params.cabina_id).update({
        cabina_name: req.body.cabina_name,
    }).then(() => {
        return res.status(200).json({
            message: "Cabina Updated"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.delete("/deleteCabina/:cabina_id", (req, res) => {
    db("cabinas").where("cabina_id", req.params.cabina_id).delete().then(() => {
        return res.status(200).json({
            message: "Cabina Deleted"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.patch("/updateStatus/:cabina_id", (req, res) => {
    db("cabinas").where("cabina_id", req.params.cabina_id).update({
        cabina_status: req.body.cabina_status
    }).then(() => {
        return res.status(200).json({
            message: "Cabina Active Status Updated"
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.get("/getEmployeeCabina/:month/:year/:cabina_id", async (req, res) => {
    const savedCabinaData = await db.raw(`
        SELECT 
            saved_cabinas.saved_cabina_id,
            saved_cabinas.emp_id,
            saved_cabinas.month,
            saved_cabinas.year,
            saved_cabinas.cabina_id,
            saved_cabinas.st_id,
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name,
            saved_cabinas.phone,
            saved_cabinas.expiry_passport,
            saved_cabinas.expire_accomodation,
            saved_cabinas.price,
            tbl_employees.country,
            tbl_employees.birth_date,
            saved_cabinas.city,
            saved_cabinas.passport_number,
            saved_cabinas.accomodation_number,
            saved_cabinas.job,
            saved_cabinas.asaish_code,
            cabinas.cabina_name,
            tbl_staffs.staff_name
        FROM
            saved_cabinas
            JOIN tbl_employees ON (saved_cabinas.emp_id = tbl_employees.emp_id)
            JOIN cabinas ON (saved_cabinas.cabina_id = cabinas.cabina_id)
            JOIN tbl_staffs ON (saved_cabinas.st_id = tbl_staffs.st_id)
        WHERE
            saved_cabinas.month = ? AND
            saved_cabinas.year = ? AND
            saved_cabinas.cabina_id = ?
    `, [req.params.month, req.params.year, req.params.cabina_id]).then(d => { return d[0] })

    if(savedCabinaData.length > 0) {
        return res.status(200).send(savedCabinaData);
    } else {
        const cabinaData = await db.raw(`
            SELECT
                tbl_employees.emp_id,
                tbl_employees.st_id,
                CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name,
                tbl_employees.phone,
                tbl_employees.expiry_passport,
                tbl_employees.expire_accomodation,
                tbl_employees.country,
                tbl_employees.city,
                tbl_employees.passport_number,
                tbl_employees.accomodation_number,
                tbl_employees.birth_date,
                tbl_employees.job,
                tbl_employees.asaish_code,
                cabinas.cabina_id,
                cabinas.cabina_name,
                tbl_staffs.staff_name
            FROM
                tbl_employees
                JOIN cabinas ON (tbl_employees.cabina_id = cabinas.cabina_id)
                JOIN tbl_staffs ON (tbl_employees.st_id = tbl_staffs.st_id)
            WHERE
                tbl_employees.cabina_id IS NOT NULL AND tbl_employees.cabina_id = ? AND tbl_employees.active_status = '1'
        `, [req.params.cabina_id]).then(d => { return d[0] })

        return res.status(200).send(cabinaData);
    }
})



router.post("/saveEmployeeCabina/:month/:year/:price/:cabina_id", async (req, res) => {
    const cabinaData = await db.raw(`
            SELECT
                tbl_employees.emp_id as emp_id,
                ${req.params.month} as month,
                ${req.params.year} as year,
                ${req.params.price} as price,
                tbl_employees.cabina_id as cabina_id,
                tbl_employees.st_id as st_id,
                tbl_employees.phone as phone,
                tbl_employees.expiry_passport as expiry_passport,
                tbl_employees.expire_accomodation as expire_accomodation,
                tbl_employees.city as city,
                tbl_employees.job as job,
                tbl_employees.asaish_code as asaish_code,
                tbl_employees.passport_number as passport_number,
                tbl_employees.accomodation_number as accomodation_number
            FROM
                tbl_employees
            WHERE
                tbl_employees.cabina_id IS NOT NULL AND tbl_employees.cabina_id = ? AND tbl_employees.active_status = '1'
        `, [req.params.cabina_id]).then(d => { return d[0] })

    await db("saved_cabinas").insert(cabinaData).then(async () => {
        const savedCabinaData = await db.raw(`
            SELECT 
                saved_cabinas.saved_cabina_id,
                saved_cabinas.emp_id,
                saved_cabinas.month,
                saved_cabinas.year,
                saved_cabinas.cabina_id,
                saved_cabinas.st_id,
                CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name,
                saved_cabinas.phone,
                saved_cabinas.expiry_passport,
                saved_cabinas.expire_accomodation,
                saved_cabinas.price,
                tbl_employees.country,
                tbl_employees.birth_date,
                saved_cabinas.city,
                saved_cabinas.job,
                saved_cabinas.asaish_code,
                saved_cabinas.passport_number,
                saved_cabinas.accomodation_number,
                cabinas.cabina_name,
                tbl_staffs.staff_name
            FROM
                saved_cabinas
                JOIN tbl_employees ON (saved_cabinas.emp_id = tbl_employees.emp_id)
                JOIN cabinas ON (saved_cabinas.cabina_id = cabinas.cabina_id)
                JOIN tbl_staffs ON (saved_cabinas.st_id = tbl_staffs.st_id)
            WHERE
                saved_cabinas.month = ? AND
                saved_cabinas.year = ? AND
                saved_cabinas.cabina_id = ?
        `, [req.params.month, req.params.year, req.params.cabina_id]).then(d => { return d[0] })

        return res.status(200).send(savedCabinaData);
    })

})

router.delete("/deleteEmployeeCabina/:month/:year/:cabina_id", (req, res) => {
    db("saved_cabinas").where("month", req.params.month).andWhere("year", req.params.year).andWhere('cabina_id', req.params.cabina_id).delete().then(async () => {

        const cabinaData = await db.raw(`
            SELECT
                tbl_employees.emp_id,
                tbl_employees.st_id,
                CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as full_name,
                tbl_employees.phone,
                tbl_employees.expiry_passport,
                tbl_employees.expire_accomodation,
                tbl_employees.country,
                tbl_employees.city,
                tbl_employees.passport_number,
                tbl_employees.accomodation_number,
                tbl_employees.birth_date,
                tbl_employees.job,
                tbl_employees.asaish_code,
                cabinas.cabina_id,
                cabinas.cabina_name,
                tbl_staffs.staff_name
            FROM
                tbl_employees
                JOIN cabinas ON (tbl_employees.cabina_id = cabinas.cabina_id)
                JOIN tbl_staffs ON (tbl_employees.st_id = tbl_staffs.st_id)
            WHERE
                tbl_employees.cabina_id IS NOT NULL AND tbl_employees.cabina_id = ? AND tbl_employees.active_status = '1' 
        `, [req.params.cabina_id]).then(d => { return d[0] })

        return res.status(200).send(cabinaData); 

    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

module.exports = router