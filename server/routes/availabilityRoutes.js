// routes/availabilityRoutes.js
const express = require('express');
const { checkJwt } = require('../middleware/auth');
const router = express.Router();

const {
  getAvailability,
  setAvailability,
  updateAvailability,
  deleteAvailability,
  getAllDoctorSlots
} = require('../controllers/availabilityController');

const {
  addAbsence,
  deleteAbsence,
  getAbsences
} = require('../controllers/absenceController');

// Availability routes
router.post('/availability', checkJwt, setAvailability); // Create availability
router.get('/availability/:doctorId', checkJwt, getAvailability); // Get availability by doctorId
router.put('/availability/:id', checkJwt, updateAvailability); // Update availability
router.delete('/availability/:id', checkJwt, deleteAvailability); // Delete availability
router.get('/all-slots', checkJwt, getAllDoctorSlots);

// Absence routes
router.post('/absences', checkJwt, addAbsence); // Add an absence
router.get('/absences/:doctorId', checkJwt, getAbsences); // Get absences by doctorId
router.delete('/absences/:id', checkJwt, deleteAbsence); // Delete an absence

module.exports = router;
