// models/user.js
const mongoose = require('mongoose');
const SecretKey ="2809a95eedde5863d8e8e3bea5205cd62d290b10a3769afee677b8754a4d05b7"

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

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, SecretKey); // Use your secret key
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
