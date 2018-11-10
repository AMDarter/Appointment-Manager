var mongoose = require("mongoose");
var appointmentSchema = new mongoose.Schema({
  title: { type: String },
  start: { type: String },
  lastName: { type: String },
  firstName: { type: String },
  phoneNumber: { type: String },
  date: { type: String },
  time: { type: String },
  period: { type: String },
  isCheckedIn: { type: Boolean }
});
module.exports = mongoose.model("Appointment", appointmentSchema);
