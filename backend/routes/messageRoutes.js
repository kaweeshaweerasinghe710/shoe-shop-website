const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Message model
let Message;
try {
  Message = require('../models/Message');
} catch {
  const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
  }, { timestamps: true });
  Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
}

// POST /api/messages — Save a message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = new Message({ name, email, subject, message });
    const saved = await newMessage.save();

    res.status(201).json({ message: 'Message saved successfully', data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while saving message' });
  }
});

// GET /api/messages — Retrieve all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ total: messages.length, data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

module.exports = router;
