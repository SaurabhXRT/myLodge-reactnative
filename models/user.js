// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  password: String,
  age: Number,
  gender: String,
  address: String,
  studyingIn: String,
  bio: String,
  profileImage: String, // Added field for Cloudinary link
});

const User = mongoose.model('User', userSchema);

module.exports = User;
