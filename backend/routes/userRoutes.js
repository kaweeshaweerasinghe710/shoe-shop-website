const express = require('express');
const router = express.Router();
const User = require('../models/User');

// =========================
// REGISTER (SIGNUP)
// =========================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check if email already exists
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: "user",   // signup always creates normal user
      name: name || ""
    });

    await user.save();
    res.json({ message: "Registration successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// LOGIN
// =========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET ALL USERS
// =========================
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// UPDATE USER ROLE (ADMIN ONLY)
// =========================
router.put('/:id', async (req, res) => {
  try {
    const { role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Role updated successfully", updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
