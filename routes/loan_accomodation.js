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

router.get('/all', (req, res) => {
    db('loan_accomodation_view').select().orderBy('datetime_create', 'asc').then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(500).send({
            err
        })
    })
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