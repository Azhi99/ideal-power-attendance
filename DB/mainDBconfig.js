require("dotenv").config();
const db = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.HOST,
        user: 'root',
        password: process.env.PASS,
        database: process.env.MAIN_DB,
        timezone: 'utc'
    }
});

module.exports =  db ;