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
    const vacantRooms = await Room.find({   capacity: { $gt: 0 }});
    res.json(vacantRooms);
  } catch (error) {
    console.error('Error fetching vacant rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/allot-room', async (req, res) => {
  try {
    const { roomId, selectedStudent, secondStudent, allotmentDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // if (room.isFilled) {
    //   return res.status(400).json({ error: 'Room is already filled' });
    // }

    if (room.capacity === 0) {
      return res.status(400).json({ error: 'Room is at full capacity' });
    }

    const studentsToAllot = [selectedStudent];
    if (room.capacity === 2 && secondStudent) {
      studentsToAllot.push(secondStudent);
      room.capacity = 0; 
    } else if(room.capacity === 1  && selectedStudent) {
      room.capacity = 0; 
    } else {
      room.capacity = 1;
    }

    room.isFilled = true;
    room.students = studentsToAllot;
    await room.save();

    // Update students' room details
    for (const studentId of studentsToAllot) {
      const student = await User.findById(studentId);
      if (student) {
        student.room = roomId;
        student.dateJoined = allotmentDate;
        await student.save();
      }
    }

    res.json({ message: 'Room allotted successfully' });
  } catch (error) {
    console.error('Error allotting room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ room: null }); 
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
