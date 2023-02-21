const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const session = require("client-sessions");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const db_user = require("./DB/userDBconfig.js");
const db = require("./DB/mainDBconfig.js"); 

const jobRouter = require("./routes/job.js");
const staffRouter = require("./routes/staff.js");
const userRouter = require("./routes/user.js");
const enginnerRouter = require('./routes/engineer.js')
const employeeRouter = require("./routes/employees.js");
const dailyStaffListRouter = require("./routes/daily_staff_list.js");
const attendanceRouter = require('./routes/attendance');
const indexRouter = require("./routes/indexPage.js");
const giveSalaryRouter = require("./routes/gived_salary.js");
const expirePassportRouter = require("./routes/expirePassport.js");
const staffExpensesRouter = require("./routes/staff_expenses.js");
const loanAccomodationRouter = require("./routes/loan_accomodation.js");

const app = express();
var port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true
}));

app.use(session({
  cookieName: "session",
  secret: "suly_tech_staff",
  duration: 12 * 60 * 60 * 1000,
  activeDuration: 10 * 60 * 60 * 1000
}));

app.use("/job", jobRouter);
app.use("/user", userRouter);
app.use("/employee", employeeRouter);
app.use("/staff", staffRouter);
app.use("/user", userRouter);
app.use("/engineer", enginnerRouter)
app.use("/daily_staff_list", dailyStaffListRouter);
app.use('/attendance',attendanceRouter);
app.use('/index', indexRouter);
app.use('/gived_salary', giveSalaryRouter);
app.use('/expirePassport', expirePassportRouter);
app.use('/staff_expenses', staffExpensesRouter);
app.use('/loan_accomodation', loanAccomodationRouter);


app.post("/isLogged", (req, res) => {
  if(req.session.isLogged == true) {
    return res.status(200).send(true);
  } 
  return res.status(500).send(false);
});

app.post("/getLoggedInfo", (req, res) => {
  if(req.session.isLogged == true) {
    return res.status(200).json({
      type: req.session.user_type,
      username: req.session.username,
      en_id: req.session.en_id || null,
      user_id: req.session.user_id
    });
  } 
  return res.status(500).json({
    message: "Not Logged"
  });
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "You are tried more than 10 times in a hour, wiat until 1 hour"
});

app.post("/login", loginLimiter, (req, res) => {
  if(!req.session.isLogged){
    db_user("tbl_users").where("username", (req.body.username).trim()).select().limit(1).then(([data]) => {
      if(typeof data != "undefined"){
        bcrypt.compare(req.body.password, data.password, (err, result) => {
          if(result){
            if(data.active_status == 1){
              req.session.isLogged = true;
              req.session.username = data.full_name;
              req.session.user_type = data.role;
              req.session.en_id = data.en_id;
              req.session.user_id = data.user_id;
              return res.status(200).send(true);
            } else {
              return res.status(500).json({
                message: "This Account is locked"
              });
            }
          } else {
            return res.status(500).json({
              message: "Wrong password"
            });
          }
        });
      } else {
        return res.status(500).json({
          message: "Wrong phone number"
        });
      }
    });
  }
});

app.get('/getNames', (req, res) => {
  db('names').select().first().then(data => {
    return res.status(200).send(data)
  })
})

app.post('/setNames', (req, res) => {
  db('names').whereRaw('1=1').update({
    manager: req.body.manager,
    accountant: req.body.accountant,
    kargeri: req.body.kargeri,
  }).then(data => {
    return res.sendStatus(200)
  })
})

app.post("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).send(true);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});