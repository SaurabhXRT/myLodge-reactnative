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
    let image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

    const post = new Post({
      text,
      image,
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
    const posts = await Post.find().populate('createdBy', 'name profileImage').sort({ createdAt: -1 }); 
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/comment/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      text,
      createdBy: userId,
    };

    post.comments.push(comment);
    await post.save();

    res.json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/like/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const alreadyLikedIndex = post.likes.findIndex((id) => id.equals(userId));

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ message: 'Post like updated successfully' });
  } catch (error) {
    console.error('Error updating post like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/comments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate({
      path: 'comments.createdBy',
      select: 'name profileImage',
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = post.comments.map((comment) => ({
      text: comment.text,
      createdBy: {
        name: comment.createdBy.name,
        profileImage: comment.createdBy.profileImage,
      },
      createdAt: comment.createdAt,
    }));

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user-room-data', async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('room');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.room) {
      return res.json({ message: 'User is not assigned to a room' });
    }
    const room = await Room.findById(user.room);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const roomPartners = await User.find({ room: room._id, _id: { $ne: userId } });
    const responseData = {
      roomNumber: room.roomNumber,
      roomPartners: roomPartners.map(partner => ({
        name: partner.name,
      })),
      //roompartner: roomPartners.name,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching room information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
