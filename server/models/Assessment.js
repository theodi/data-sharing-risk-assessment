const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  date_created: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
  answers: { type: Array, default: [] },
  data_capture: { type: Object, default: {} },
  status: { type: String, default: "started" }
});

module.exports = mongoose.model('Assessment', assessmentSchema);