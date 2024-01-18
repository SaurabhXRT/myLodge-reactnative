const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Room = require('../models/room');
const User = require('../models/user');

router.use(authMiddleware);

router.get("/fetch-dues", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const roomDues = room.dues;
    res.json(roomDues);
  } catch (error) {
    console.error('Error finding dues:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetch-payments', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const payments = room.payment;
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
