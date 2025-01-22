// models/Availability.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: Number,
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
  },
  daysOfWeek: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  startTime: String,
  endTime: String,
  repeat: {
    type: Boolean,
    default: false
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
