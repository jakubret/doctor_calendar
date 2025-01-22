// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose'); // Add this line to import mongoose
exports.getAppointment = (req, res) => {
    Appointment.findById(req.params.id)
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json(appointment);
        })
        .catch(error => res.status(500).json({ message: error.message }));
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, startDateTime, endDateTime, type, patientName } = req.body;

    if (!doctorId || !patientId || !startDateTime || !endDateTime) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      startDateTime,
      endDateTime,
      type,
      patientName,
      patientGender,
      patientAge,
      patientNotes

    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateAppointment = (req, res) => {
  const { doctorId, patientId } = req.body;

  if ((doctorId && !mongoose.Types.ObjectId.isValid(doctorId)) || 
      (patientId && !mongoose.Types.ObjectId.isValid(patientId))) {
    return res.status(400).json({ message: 'Invalid doctorId or patientId' });
  }

  const updates = req.body;
  Appointment.findByIdAndUpdate(req.params.id, updates, { new: true })
    .then(updatedAppointment => {
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(updatedAppointment);
    })
    .catch(error => res.status(500).json({ message: error.message }));
};


exports.deleteAppointment = (req, res) => {
    Appointment.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.status(204).json();
        })
        .catch(error => res.status(500).json({ message: error.message }));
};
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required.' });
    }

    const appointments = await Appointment.find({ doctorId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};