const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Room = require('../models/room');
const User = require('../models/user');
const Post = require('../models/posts');
const cloudinary = require("cloudinary").v2;
const app = express();
const cors = require('cors');
app.use(cors());

cloudinary.config({
  cloud_name: "dar4ws6v6",
  api_key: "131471632671278",
  api_secret: "d0UW2ogmMnEEMcNVcDpzG33HKkY",
});

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });

router.use(authMiddleware);

router.get("/fetch-dues", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDues = user.dues;
    console.log(userDues);
    res.json(userDues);
  } catch (error) {
    console.error('Error finding dues:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetch-payments', async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const payments = user.payment;
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/posts',uploads.single('image'), async (req, res) => {
  try {
    const text = req.body.text || 'no caption';
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const createdBy = userId;
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("result");

    const post = new Post({
      text,
      image: result.secure_url,
      createdBy 
    });
    await post.save();
    await user.posts.push(post._id);
    await user.save();

    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'name');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
