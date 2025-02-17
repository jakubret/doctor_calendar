// controllers/availabilityController.js
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
exports.setAvailability = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Logowanie danych wejściowych
    const { doctorId, startDate, endDate, daysOfWeek, startTime, endTime, repeat } = req.body;

    // Validate required fields
    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({ message: 'doctorId, startDate, and endDate are required.' });
    }

    const availability = new Availability({
      doctorId,
      startDate,
      endDate,
      daysOfWeek,
      startTime,
      endTime,
      repeat
    });

    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    console.error('Error in setAvailability:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: 'doctorId is required.' });
    }

    const availability = await Availability.find({ doctorId });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Availability ID is required.' });
    }

    const updatedAvailability = await Availability.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedAvailability) {
      return res.status(404).json({ message: 'Availability not found.' });
    }

    res.json(updatedAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Availability ID is required.' });
    }

    const deletedAvailability = await Availability.findByIdAndDelete(id);

    if (!deletedAvailability) {
      return res.status(404).json({ message: 'Availability not found.' });
    }

    res.status(204).json({ message: 'Availability deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required.' });
    }

    // Pobierz dostępności lekarza
    const availability = await Availability.find({ doctorId });

    // Pobierz istniejące wizyty
    const appointments = await Appointment.find({ doctorId });

    const slots = availability.map((day) => {
      const daySlots = day.daysOfWeek.map((dayOfWeek) => {
        const slots = [];
        let time = new Date(`${day.startDate}T${day.startTime}`);
        const endTime = new Date(`${day.startDate}T${day.endTime}`);

        while (time < endTime) {
          const isBooked = appointments.some(
            (appointment) =>
              appointment.startDateTime.getTime() === time.getTime()
          );

          slots.push({
            time: new Date(time),
            booked: isBooked,
          });

          time = new Date(time.getTime() + day.timeSlotInterval * 60000);
        }
        return { dayOfWeek, slots };
      });
      return { date: day.startDate, slots: daySlots };
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllDoctorSlots = async (req, res) => {
  try {
    const availability = await Availability.find();
    const appointments = await Appointment.find();

    const slots = [];

    availability.forEach((avail) => {
      const startDate = new Date(avail.startDate);
      const endDate = new Date(avail.endDate);

      // Generowanie slotów dla każdego dnia w zakresie dat
      for (
        let currentDate = startDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const daySlots = [];
        let time = new Date(
          `${currentDate.toISOString().split('T')[0]}T${avail.startTime}`
        );
        const endTime = new Date(
          `${currentDate.toISOString().split('T')[0]}T${avail.endTime}`
        );

        while (time < endTime) {
          const isBooked = appointments.some(
            (appointment) =>
              new Date(appointment.startDateTime).getTime() ===
                time.getTime() &&
              appointment.doctorId === avail.doctorId
          );

          daySlots.push({
            time: new Date(time),
            booked: isBooked,
            doctorId: avail.doctorId,
          });

          time.setMinutes(time.getMinutes() + 30); // Interwały czasowe co 30 minut
        }

        slots.push({
          date: currentDate.toISOString().split('T')[0],
          slots: daySlots,
          doctorId: avail.doctorId,
        });
      }
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


