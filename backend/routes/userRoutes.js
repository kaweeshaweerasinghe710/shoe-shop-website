const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/login  → create or login user
router.post('/login', async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, role: role || 'user' });
      await user.save();
      return res.status(201).json({ message: 'User created', user });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users  → get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id  → update user role
router.put('/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
