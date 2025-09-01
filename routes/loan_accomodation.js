const express = require("express");
const db = require("../DB/mainDBconfig.js");

const router = express.Router();

router.post('/create_list', (req, res) => {
    if(req.body.list.length > 0) {
        db('loan_accomodation').insert({
            emp_id: req.body.loan_accomodation.emp_id,
            st_id: req.body.loan_accomodation.st_id,
            la_type: req.body.loan_accomodation.la_type,
            amount: req.body.loan_accomodation.amount,
            salary_type: req.body.loan_accomodation.salary_type,
            datetime_create: req.body.loan_accomodation.datetime_create,
            user: req.body.loan_accomodation.user,
            note: req.body.loan_accomodation.note,
            la_date: req.body.loan_accomodation.la_date,
            archived: req.body.loan_accomodation.archived,
        }).then(([la_id]) => {
            const loan_accomodation_detail = req.body.list.map((item) => {
                return {
                    la_id: la_id,
                    amount: item.amount,
                    month: item.month,
                    year: item.year,
                }
            })
            db('loan_accomodation_detail').insert(loan_accomodation_detail).then(async () => {
                const new_data = await db('loan_accomodation_view').where('la_id', la_id).select().first()
                res.status(200).send({
                    new_data
                })
            })
        })
    } else {
        return res.status(500).send({
            err: 'No data'
        })
    }
})

router.post('/getAllDetailByIds', async (req, res) => {
    const [rows] = await db.raw(`
        SELECT 
            loan_accomodation_detail.lad_id,
            loan_accomodation_detail.la_id,
            loan_accomodation_detail.amount,
            loan_accomodation_detail.month,
            loan_accomodation_detail.year,
            loan_accomodation.emp_id,
            loan_accomodation.note,
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) AS employee_full_name,
            loan_accomodation.la_type,
            loan_accomodation.st_id,
            tbl_staffs.staff_name,
            tbl_staffs.staff_sort_code,
            tbl_staffs.special_staff,
            loan_accomodation.salary_type
        FROM loan_accomodation_detail
        INNER JOIN loan_accomodation ON loan_accomodation_detail.la_id = loan_accomodation.la_id
        INNER JOIN tbl_employees ON loan_accomodation.emp_id = tbl_employees.emp_id
        INNER JOIN tbl_staffs ON loan_accomodation.st_id = tbl_staffs.st_id
        WHERE loan_accomodation_detail.la_id IN (${req.body.ids.join(',')})
    `);
    res.status(200).send(rows)
})

router.post('/all', (req, res) => {
    let q = ''
    if(req.body.month && req.body.year) {
        q += `AND la_id IN (
            SELECT la_id FROM loan_accomodation_detail WHERE month = ${req.body.month} AND year = ${req.body.year}
        )`
    }

    if(req.body.filter === 'all') {
        db.raw(`
            SELECT * FROM loan_accomodation_view WHERE ${req.body.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.body.archived}'`} ${q} ORDER BY datetime_create ASC    
        `).then((data) => {
            res.status(200).send(data[0])
        }).catch((err) => {
            res.status(500).send({
                err
            })
        })
    } else if(req.body.filter.split(',').length > 1) {
        db.raw(`SELECT * FROM loan_accomodation_view WHERE ${req.body.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.body.archived}'`} AND la_type IN (${req.body.filter.split(',').map(obj => `'${obj}'`).join(',')}) ${q}`).then(r => {
            return res.status(200).send(r[0])
        })
    } else {
        db.raw(`
            SELECT * FROM loan_accomodation_view WHERE ${req.body.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.body.archived}'`} AND la_type = '${req.body.filter}' ${q} ORDER BY datetime_create ASC    
        `).then((data) => {
            res.status(200).send(data[0])
        }).catch((err) => {
            res.status(500).send({
                err
            })
        })
    }
})

router.get('/getByEngineer/:filter/:en_id/:archived', (req, res) => {
    if(req.params.filter === 'all') {
        db.raw(`
            SELECT * FROM loan_accomodation_view WHERE ${req.params.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.params.archived}'`} AND st_id IN (
                SELECT st_id FROM tbl_staffs WHERE en_id = ${req.params.en_id}
            )
        `).then(r => {
            return res.status(200).send(r[0])
        })
    } else if(req.params.filter.split(',').length > 1) {
        db.raw(`SELECT * FROM loan_accomodation_view WHERE ${req.params.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.params.archived}'`} AND la_type IN (${req.params.filter.split(',').map(obj => `'${obj}'`).join(',')}) AND st_id IN (
            SELECT st_id FROM tbl_staffs WHERE en_id = ${req.params.en_id}
        )`).then(r => {
            return res.status(200).send(r[0])
        })
    } else {
        db.raw(`
            SELECT * FROM loan_accomodation_view WHERE ${req.params.archived == 'all' ? `archived IN ('archived', 'unarchived')` : `archived = '${req.params.archived}'`} AND la_type = '${req.params.filter}' AND st_id IN (
                SELECT st_id FROM tbl_staffs WHERE en_id = ${req.params.en_id}
            )
        `).then(r => {
            return res.status(200).send(r[0])
        })
    }
})

router.get('/getByEmployee/:emp_id', (req, res) => {
    db('loan_accomodation_view').where('emp_id', req.params.emp_id).select().then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.get('/get_detail/:la_id', (req, res) => {
    db('loan_accomodation_detail').where('la_id', req.params.la_id).select().then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.delete('/delete_detail_by_id/:id', (req, res) => {
    db('loan_accomodation_detail').where('lad_id', req.params.id).del().then(() => {
        res.sendStatus(200)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.delete('/delete_by_id/:id', (req, res) => {
    db('loan_accomodation_detail').where('la_id', req.params.id).del().then(() => {
        db('loan_accomodation').where('la_id', req.params.id).del().then(() => {
            res.sendStatus(200)
        }).catch((err) => {
            res.status(500).send({
                err
            })
        })
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.patch('/update_list', (req, res) => {
    db('loan_accomodation').where('la_id', req.body.loan_accomodation.la_id).update({
        emp_id: req.body.loan_accomodation.emp_id,
        st_id: req.body.loan_accomodation.st_id,
        la_type: req.body.loan_accomodation.la_type,
        amount: req.body.loan_accomodation.amount,
        salary_type: req.body.loan_accomodation.salary_type,
        datetime_create: req.body.loan_accomodation.datetime_create,
        user: req.body.loan_accomodation.user,
        note: req.body.loan_accomodation.note,
        la_date: req.body.loan_accomodation.la_date,
        archived: req.body.loan_accomodation.archived,
    }).then(async () => {
        const new_data = await db('loan_accomodation_view').where('la_id', req.body.loan_accomodation.la_id).select().first()
        res.status(200).send({
            new_data
        })
    })
})

router.patch('/set_amount/:lad_id', (req, res) => {
    db('loan_accomodation_detail').where('lad_id', req.params.lad_id).update({
        amount: req.body.amount
    }).then(() => {
        res.sendStatus(200)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.patch('/set_month/:lad_id', (req, res) => {
    db('loan_accomodation_detail').where('lad_id', req.params.lad_id).update({
        month: req.body.month
    }).then(() => {
        res.sendStatus(200)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.patch('/set_year/:lad_id', (req, res) => {
    db('loan_accomodation_detail').where('lad_id', req.params.lad_id).update({
        year: req.body.year
    }).then(() => {
        res.sendStatus(200)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

router.post('/add_detail', (req, res) => {
    db('loan_accomodation_detail').insert({
        la_id: req.body.la_id,
        amount: req.body.amount,
        month: req.body.month,
        year: req.body.year,
    }).then(([new_id]) => {
        res.status(200).send({
            new_id
        })
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
})

module.exports = router;