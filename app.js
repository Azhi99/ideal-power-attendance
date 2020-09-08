const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
var port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));