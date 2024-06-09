const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post('/getDataByStaff', async (req, res) => {
    let query = ''

    if(req.body.project_id) {
        query = `AND project_id = ${req.body.project_id}`
    }

    if(req.body.location) {
        query = `AND location = '${req.body.location}'`
    }

    const rows = await db.raw(`
        SELECT * FROM staff_expenses_view 
            WHERE st_id = ${req.body.staff_id} AND form BETWEEN '${req.body.from}' AND '${req.body.to}' ${query}
            ORDER BY form ASC
    `).then(data => {
        return data[0]
    });
    return res.status(200).send(rows)
})

router.get('/all', async (req, res) => {
    const rows = await db.select("*").table('staff_expenses_view').orderBy('staff_expense_id', 'desc')
    return res.status(200).send(rows)
})

router.get('/getByStaff/:st_id', async (req, res) => {
    const rows = await db.select("*").table('staff_expenses_view').where('st_id', req.params.st_id).orderBy('form', 'asc')
    return res.status(200).send(rows)
})

router.get('/getLocations', async (req, res) => {
    const rows = await db.raw(`
        SELECT DISTINCT location FROM staff_expenses WHERE location IS NOT NULL
    `).then(d => {
        return d[0]
    })

    return res.status(200).send(rows)
})

router.post('/create', async (req, res) => {
    var [[{form}]] = await db.raw(`SELECT IFNULL(MAX(form), 0) as form FROM staff_expenses WHERE st_id = ${req.body.st_id}`);
    ++form; 
    req.body.form = form;
    if(!req.body.project_id) {
        req.body.project_id = null
    }

    if(!req.body.location) {
        req.body.location = null
    }
    const insert = await db('staff_expenses').insert(req.body)
    const insertedData = await db.select("*").table('staff_expenses_view').where('staff_expense_id', insert[0])
        .then(data => {
            return data[0]
        })
    return res.status(200).send(insertedData)
})

router.patch('/update/:id', async (req, res) => {
    const update = await db('staff_expenses').where('staff_expense_id', req.params.id).update(req.body)
    const updatedData = await db.select("*").table('staff_expenses_view').where('staff_expense_id', req.params.id)
        .then(data => {
            return data[0]
        })
    return res.status(200).send(updatedData)
})

router.delete('/delete/:id', (req, res) => {
    db('staff_expenses').where('staff_expense_id', req.params.id).del().then(data => {
        return res.sendStatus(200)
    }).catch(err => {
        return res.sendStatus(500)
    })
})

module.exports = router;