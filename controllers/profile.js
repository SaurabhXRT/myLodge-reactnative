// controllers/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user');


router.use(authMiddleware);

router.get('/profiledata', async (req, res) => {
  try {
    // Get the user ID from the authenticated user's token
    const userId = req.userId;

    // Fetch user profile from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user profile
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

module.exports = router;
