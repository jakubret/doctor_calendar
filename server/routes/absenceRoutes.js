// routes/absenceRoutes.js
const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth'); // Assuming you want JWT authentication for these routes
const {
  addAbsence,
  getAbsences,
  deleteAbsence
} = require('../controllers/AbsenceController');

router.post('/', checkJwt, addAbsence); // Add a new absence
router.get('/:doctorId', checkJwt, getAbsences); // Get all absences for a specific doctor
router.delete('/:id', checkJwt, deleteAbsence); // Delete an absence by ID

module.exports = router;
