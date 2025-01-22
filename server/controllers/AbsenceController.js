// controllers/absenceController.js
const Absence = require('../models/Absence');

exports.addAbsence = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.body;

    // Validate input
    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({ message: 'doctorId, startDate, and endDate are required.' });
    }

    const absence = new Absence({
      doctorId,
      startDate,
      endDate
    });
    await absence.save();
    res.status(201).json(absence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAbsences = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: 'doctorId is required in the URL.' });
    }

    const absences = await Absence.find({ doctorId });
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Absence ID is required in the URL.' });
    }

    const deletedAbsence = await Absence.findByIdAndDelete(id);
    if (!deletedAbsence) {
      return res.status(404).json({ message: 'Absence not found.' });
    }

    res.status(204).json({ message: 'Absence deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
