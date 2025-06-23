const express = require("express");
const db = require("../DB/mainDBconfig.js");
const router = express.Router();

// Get all finishing and structure data
router.post("/getData", async (req, res) => {
    const { en_id } = req.body

    let query = ''
    let arrQuery = []

    if(en_id) {
        query += ' AND finishing_and_structure.en_id = ?'
        arrQuery.push(en_id)
    }

    const [rows] = await db.raw(`
        SELECT 
            finishing_and_structure.*,
            CONCAT(tbl_engineers.first_name, ' ', tbl_engineers.last_name) as supervisor
        FROM 
            finishing_and_structure
        LEFT JOIN tbl_engineers ON (finishing_and_structure.en_id = tbl_engineers.en_id)
        WHERE 1=1 ${query}
        ORDER BY finishing_and_structure.fs_id DESC
    `, arrQuery)

    return res.status(200).send(rows)
})


// Add new finishing and structure
router.post("/addFinishing", (req, res) => {
    const baghdadTime = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Baghdad'}))
    baghdadTime.setHours(baghdadTime.getHours() - 4)

    db("finishing_and_structure").insert({
        title: req.body.title,
        type: req.body.type,
        work_project_id: req.body.work_project_id,
        en_id: req.body.en_id,
        created_at: baghdadTime.toISOString().split('T')[0],
        note_and_changes: req.body.note_and_changes || null,
        user_name: req.body.user_name
    }).then(async ([data]) => {
        const new_data = await db.raw(`
            SELECT 
                finishing_and_structure.*,
                CONCAT(tbl_engineers.first_name, ' ', tbl_engineers.last_name) as supervisor
            FROM 
                finishing_and_structure
            LEFT JOIN tbl_engineers ON (finishing_and_structure.en_id = tbl_engineers.en_id)
            WHERE finishing_and_structure.fs_id = ${data}
        `)
        return res.status(200).json({
            message: "Finishing Added",
            fs_id: data,
            new_data: new_data[0][0]
        });
    }).catch((err) => {
        if(err.errno === 1062){
            return res.status(500).json({
                message: "This Finishing title already exists"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});

// Update finishing and structure
router.patch("/updateFinishing/:fs_id", (req, res) => {
    db("finishing_and_structure").where("fs_id", req.params.fs_id).update({
        title: req.body.title,
        type: req.body.type,
        work_project_id: req.body.work_project_id,
        note_and_changes: req.body.note_and_changes || null
    }).then(async () => {
        const new_data = await db.raw(`
            SELECT 
                finishing_and_structure.*,
                CONCAT(tbl_engineers.first_name, ' ', tbl_engineers.last_name) as supervisor
            FROM 
                finishing_and_structure
            LEFT JOIN tbl_engineers ON (finishing_and_structure.en_id = tbl_engineers.en_id)
            WHERE finishing_and_structure.fs_id = ?
        `, [req.params.fs_id])

        return res.status(200).json({
            message: "Finishing Updated",
            new_data: new_data[0][0]
        });
    }).catch((err) => {
        if(err.errno === 1062){
            return res.status(500).json({
                message: "This Finishing title already exists"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});

// Delete finishing and structure
router.delete("/deleteFinishing/:fs_id", (req, res) => {
    db("finishing_and_structure").where("fs_id", req.params.fs_id).delete().then(() => {
        return res.status(200).json({
            message: "Finishing Deleted"
        });
    }).catch((err) => {
        if(err.errno === 1451){
            return res.status(500).json({
                message: "Cannot delete this finishing, it is used elsewhere"
            });
        }
        return res.status(500).json({
            message: err
        });
    });
});


router.post('/addEmptyDetail', async (req, res) => {
    db('fs_details').insert({
        fs_id: req.body.fs_id
    }).then(([data]) => {
        return res.status(200).send({
            fsd_id: data
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        });
    })
})

router.post('/updateDetail/:fsd_id', async (req, res) => {
    db('fs_details').where('fsd_id', req.params.fsd_id).update({
        work: req.body.work,
        complete: req.body.complete,
        not_complete: req.body.not_complete,
        st_id: req.body.st_id,
        receive_date: req.body.receive_date ? req.body.receive_date : null,
        note: req.body.note || null,
    }).then(() => {
        return res.status(200).send({
            message: "Detail Updated"
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})

router.get('/getDetails/:fs_id', async (req, res) => {
    db('fs_details').select().orderBy('fsd_id', 'asc').where('fs_id', req.params.fs_id).then(data => {
        return res.status(200).send(data)
    }).catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})

module.exports = router;