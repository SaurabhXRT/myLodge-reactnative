// routes/room.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Room = require('../models/room');
const User = require('../models/user');

router.use(authMiddleware);

// Get all rooms
router.get('/filledRooms', async (req, res) => {
  try {
    const rooms = await Room.find({isFilled: true});
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get vacant rooms
router.get('/vacantrooms', async (req, res) => {
  try {
    const vacantRooms = await Room.find({ isFilled: false, isFilled: true, capacity > 0 });
    res.json(vacantRooms);
  } catch (error) {
    console.error('Error fetching vacant rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Allot room to a student
router.post('/allot-room', async (req, res) => {
  try {
    const { roomId, studentId, dateJoined } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (room.isFilled) {
      return res.status(400).json({ error: 'Room is already filled' });
    }

    room.isFilled = true;
    room.students.push(studentId);
    await room.save();

    // Update student's room details
    student.room = roomId;
    student.dateJoined = dateJoined;
    await student.save();

    res.json({ message: 'Room allotted successfully' });
  } catch (error) {
    console.error('Error allotting room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
