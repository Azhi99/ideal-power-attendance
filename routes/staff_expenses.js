const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.get('/all', async (req, res) => {
    const rows = await db.select("*").table('staff_expenses')
    return res.status(200).send(rows)
})

router.post('/create', async (req, res) => {
    const insert = await db('staff_expenses').insert(req.body)
    const insertedData = await db.select("*").table('staff_expenses').where('staff_expense_id', insert[0])
        .then(data => {
            return data
        })
    return res.status(200).send(insertedData)
})

router.put('/update/:id', async (req, res) => {
    const update = await db('staff_expenses').where('staff_expense_id', req.params.id).update(req.body)
    const updatedData = await db.select("*").table('staff_expenses').where('staff_expense_id', req.params.id)
        .then(data => {
            return data
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

router.delete('/delete_list', (req, res) => {})

module.exports = router;