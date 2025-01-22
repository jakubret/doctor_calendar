const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  roleId: { type: Number }, // Numer ID generowany automatycznie
});

userSchema.plugin(AutoIncrement, { inc_field: 'roleId', start_seq: 1 });
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;

