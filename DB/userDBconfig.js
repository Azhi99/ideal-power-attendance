require("dotenv").config();
const db = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.HOST,
        user: 'root',
        password: process.env.PASS,
        database: process.env.USER_DB
    }
});

module.exports =  db ;