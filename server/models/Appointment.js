// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: Number,
    ref: 'User',
    required: true
  },
  patientId: {
    type: Number,
    ref: 'User',
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  patientName: String,
  patientGender: String,
  patientAge: Number,
  patientNotes: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
