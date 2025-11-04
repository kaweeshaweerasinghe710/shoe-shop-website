const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// ✅ Create a new category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all categories (with optional search by name)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    const categories = await Category.find(filter);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update a category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
