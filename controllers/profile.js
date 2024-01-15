// controllers/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const cloudinary = require("cloudinary").v2;
const User = require('../models/user');
const app = express();
const cors = require('cors');
app.use(cors());

cloudinary.config({
  cloud_name: "dar4ws6v6",
  api_key: "131471632671278",
  api_secret: "d0UW2ogmMnEEMcNVcDpzG33HKkY",
});


router.use(authMiddleware);

router.get('/profiledata', async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      mobile: user.mobile,
      age: user.age,
      gender: user.gender,
      address: user.address,
      studyingIn: user.studyingIn,
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateprofile', async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.studyingIn = req.body.studyingIn || user.studyingIn;
    user.bio = req.body.bio || user.bio;
    //user.profileImage = req.body.profileImage || user.profileImage;
    if (req.file) {
      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("result");
      user.profileImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    await user.save();
    res.json({
      name: user.name,
      mobile: user.mobile,
      age: user.age,
      gender: user.gender,
      address: user.address,
      studyingIn: user.studyingIn,
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
