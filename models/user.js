// models/user.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const SecretKey = "2809a95eedde5863d8e8e3bea5205cd62d290b10a3769afee677b8754a4d05b7";

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  age: Number,
  gender: String,
  address: String,
  studyingIn: String,
  bio: String,
  profileImage: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null }, 
  dateJoined: { type: Date, default: null }, 
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, SecretKey);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
