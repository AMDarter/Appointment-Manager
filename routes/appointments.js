var express = require("express"),
  router = express.Router(),
  Nexmo = require("nexmo"),
  keys = require("../config/keys"),
  Appointment = require("../models/Appointment");

const nexmo = new Nexmo({
  apiKey: keys.nexmoApiKey,
  apiSecret: keys.nexmoApiSecret
});

// APPOINTMENTS ROUTE
router.get("/", isLoggedIn, (req, res) => {
  Appointment.find({}, (err, appointmentList) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("appointments", { appointmentList: appointmentList });
    }
  });
});

// SEARCH RESULTS ROUTE
router.get("/results", isLoggedIn, function(req, res) {
  var queryDate = req.query.formSearchDate;
  var queryLastName = req.query.formSearchLastName;
  Appointment.find(
    {
      $or: [{ lastName: queryLastName }, { date: queryDate }]
    },
    function(err, appointmentList) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.render("results", {
          appointmentList: appointmentList
        });
      }
    }
  );
});

//ADD NEW APPOINTMENT
router.post("/new", isLoggedIn, (req, res) => {
  var newAppointment = new Appointment({
    title: req.body.firstName + " " + req.body.lastName,
    start: req.body.date + "T" + req.body.time,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    date: req.body.date,
    time: req.body.time,
    period: req.body.period,
    isCheckedIn: req.body.isCheckedIn
  });
  Appointment.create(newAppointment, (err, appointment) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

// DESTROY APPOINTMENT
router.delete("/:id", isLoggedIn, (req, res) => {
  Appointment.findOneAndDelete({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/appointments");
    }
  });
});

// UPDATE ROUTE
router.put("/:id", isLoggedIn, (req, res) => {
  Appointment.updateOne(
    { _id: req.params.id },
    { $set: { isCheckedIn: true } },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(responseData);
        const number = keys.myPhone;
        const message = "Patient has arrived for his/her appointment";
        nexmo.message.sendSms(
          keys.nexmoPhone,
          number,
          message,
          { type: "unicode" },
          (err, responseData) => {
            if (err) {
              console.log(err);
            } else {
              console.dir(responseData);
              res.redirect("/appointments/checkmark");
            }
          }
        );
      }
    }
  );
});

router.get("/checkmark", isLoggedIn, (req, res) => {
  res.render("checkmark");
});

router.get("/data", isLoggedIn, function(req, res) {
  Appointment.find({}, (err, appointmentData) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.json(appointmentData);
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
