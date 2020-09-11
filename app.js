const express = require("express");
require("dotenv").config();
const cors = require("cors");

const jobRouter = require("./routes/job.js");
const staffRouter = require("./routes/staff.js");
const userRouter = require("./routes/user.js");
const enginnerRouter= require('./routes/engineer.js')


const app = express();
var port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/job", jobRouter);
app.use("/staff", staffRouter);
app.use("/user", userRouter);
app.use('/engineer',enginnerRouter)