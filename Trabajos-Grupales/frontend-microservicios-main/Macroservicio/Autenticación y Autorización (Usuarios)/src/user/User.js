// src/user/User.js
const mongoose = require('mongoose');

const validateEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is required' },
  email: {
    type: String,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  state: { type: String, enum: ['active', 'inactive'], default: 'active' },
  dateCreate: { type: Date, default: () => new Date() },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
