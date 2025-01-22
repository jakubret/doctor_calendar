// models/Absence.js
const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
  doctorId: {
    type: Number, // Changed from ObjectId to Number
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

const Absence = mongoose.model('Absence', absenceSchema);

module.exports = Absence;
