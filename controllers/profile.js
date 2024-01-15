// controllers/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');


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
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.studyingIn = req.body.studyingIn || user.studyingIn;
    user.bio = req.body.bio || user.bio;
    await user.save();
    const profileupdated = "profile updated";
    res.json({profileupdated });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
