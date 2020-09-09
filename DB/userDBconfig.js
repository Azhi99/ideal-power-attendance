require("dotenv").config();
const db = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.USER_DB
    }
});

module.exports = { db };