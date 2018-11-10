var express = require("express"),
  router = express.Router(),
  Appointment = require("../models/Appointment");

router.use("/appointments", require("./appointments"));

router.get("/", isLoggedIn, (req, res) => {
  Appointment.find({}, (err, appointmentList) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("index", { appointmentList: appointmentList });
    }
  });
});

router.get("/user", isLoggedIn, function(req, res) {
  res.render("user");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// REMOVE COLLECTION
// Appointment.remove().exec(function(error) {
//   if (error) {
//     console.log("Uh oh: " + error);
//   } else {
//     console.log("[Existing Collection Deleted]");
//   }
// });

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
