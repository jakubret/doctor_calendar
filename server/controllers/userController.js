const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config.json'); // Ensure your JWT_SECRET is here

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!['doctor', 'patient'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be doctor or patient.' });
    }

    // Sprawdź, czy użytkownik już istnieje
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Utwórz nowego użytkownika
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', roleId: user.roleId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Log in a user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, roleId: user.roleId }); // Zwracanie roleId
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


    