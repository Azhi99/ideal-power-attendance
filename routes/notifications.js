// create crud to notifications
const express = require('express');
const db = require('../DB/mainDBconfig.js');
const router = express.Router();

router.post('/getData', (req, res) => {
    db.raw(`
        SELECT 
            notifications.*,
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as emp_name
        FROM
            notifications
        LEFT JOIN tbl_employees ON (notifications.emp_id = tbl_employees.emp_id)
    `).then(data => {
        return res.status(200).send(data[0]);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post('/getDataByUser/:user_id', (req, res) => {
    db.raw(`
        SELECT 
            notifications.*,
            CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as emp_name
        FROM
            notifications
        LEFT JOIN tbl_employees ON (notifications.emp_id = tbl_employees.emp_id)
        WHERE
        notifications.user_id = ${req.params.user_id}
    `).then(data => {
        return res.status(200).send(data[0]);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post('/getActiveEmployee', (req, res) => {
    db.raw(`
        SELECT 
            *
        FROM
            notifications
        WHERE display_type = 'active_employee'
    `).then(data => {
        return res.status(200).send(data[0]);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post('/getNotificationUsers/:notification_id', (req, res) => {
    db('notifications_users').select('user_id', 'full_name').where('notification_id', req.params.notification_id).then((data) => {
        return res.status(200).send(data);
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.post('/getByID/:notification_id', async (req, res) => {
    const notification = await db.raw(`
        SELECT 
            notifications.*,
            tbl_employees.st_id
        FROM
            notifications
        LEFT JOIN tbl_employees ON (notifications.emp_id = tbl_employees.emp_id)
        WHERE
            notifications.notification_id = ${req.params.notification_id}
    `).then(data => {
        return data[0][0]
    })
    const users = await db('notifications_users').select('user_id', 'full_name').where('notification_id', req.params.notification_id)

    return res.status(200).send({
        notification,
        users
    });

})

router.post('/addNotification', (req, res) => {
    const body = req.body.notification
    body.createdAt = new Date().toISOString().split('T')[0]

    let selected_users = req.body.selected_users

    db('notifications').insert(body).then((data) => {
        selected_users = selected_users.map((user) => {
            return {
                notification_id: data[0],
                user_id: user.user_id,
                full_name: user.full_name,
            }
        })

        db('notifications_users').insert(selected_users).then(async () => {
            
            const new_data = await db.raw(`
                SELECT 
                    notifications.*,
                    CONCAT(tbl_employees.first_name, ' ', tbl_employees.last_name) as emp_name
                FROM
                    notifications
                LEFT JOIN tbl_employees ON (notifications.emp_id = tbl_employees.emp_id)
                WHERE
                    notifications.notification_id = ${data[0]}
            `).then(d => {
                return d[0][0]
            })

            return res.status(200).send({
                message: 'Notification Added',
                new_data
            });
        })

    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.patch('/changeShow/:notification_id', (req, res) => {
    db('notifications').where('notification_id', req.params.notification_id).update({
        show_notification: req.body.show_notification
    }).then(() => {
        return res.status(200).json({
            message: 'Notification shown'
        });
    });
})

router.patch('/updateNotification/:notification_id', (req, res) => {
    const body = req.body.notification
    let selected_users = req.body.selected_users


    db('notifications').where('notification_id', req.params.notification_id).update(body).then(async () => {
        await db('notifications_users').where('notification_id', req.params.notification_id).delete()
        selected_users = selected_users.map((user) => {
            return {
                notification_id: req.params.notification_id,
                user_id: user.user_id,
                full_name: user.full_name,
            }
        })

        db('notifications_users').insert(selected_users).then(() => {
            return res.status(200).json({
                message: 'Notification Updated'
            });
        })
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})

router.delete('/deleteNotification/:notification_id', (req, res) => {
    db('notifications').where('notification_id', req.params.notification_id).delete().then(() => {
        return res.status(200).json({
            message: 'Notification Deleted'
        });
    }).catch((err) => {
        return res.status(500).json({
            message: err
        });
    });
})


module.exports = router;