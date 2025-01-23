const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth');
const {
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');


//router.get('/slots/:doctorId', checkJwt, getDoctorSlots); // Nowa trasa dla slotów
router.get('/:id', checkJwt, getAppointment);
router.post('/book', checkJwt, createAppointment);
router.put('/:id', checkJwt, updateAppointment);
router.delete('/:id', checkJwt, deleteAppointment);
// Assuming you have an endpoint setup to fetch appointments for a patient
//router.get('/bookings', checkJwt, appointmentController.getAppointmentsForPatient);

module.exports = router;
