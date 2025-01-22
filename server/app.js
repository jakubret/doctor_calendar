const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes'); // Import availability routes
const config = require('./config.json');

// Initialize the express application
const app = express();

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Define API routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api', availabilityRoutes); // Add availability and absence routes

// Serve a basic route to confirm the API is running
app.get('/', (req, res) => {
  res.send('API Running');
});

// Define the server's port
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
