const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');   // Use your real Review model

// -----------------------------
// POST /api/reviews  (Create Review)
// -----------------------------
router.post('/', async (req, res) => {
  try {
    const { product, rating, comment, user } = req.body;

    if (!product || !rating || !comment) {
      return res.status(400).json({ message: 'product, rating, and comment are required' });
    }

    // Validate rating
    const r = Number(rating);
    if (r < 1 || r > 5) {
      return res.status(400).json({ message: 'rating must be 1–5' });
    }

    const review = new Review({
      product,
      rating: r,
      comment,
      user
    });

    const saved = await review.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// -----------------------------
// GET /api/reviews  (Get All Reviews, with populate)
// -----------------------------
router.get('/', async (req, res) => {
  try {
    const { product, page = 1, limit = 20 } = req.query;

    const query = {};
    if (product) query.product = product;

    const pageNum = Math.max(1, parseInt(page));
    const perPage = Math.max(1, Math.min(100, parseInt(limit)));

    const [data, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name email') // ✨ populate user name & email
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * perPage)
        .limit(perPage),

      Review.countDocuments(query)
    ]);

    res.json({
      total,
      page: pageNum,
      perPage,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// -----------------------------
// GET /api/reviews/:id  (Get Single Review)
// -----------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findById(id)
      .populate('user', 'name email');

    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json(review);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching review' });
  }
});

// -----------------------------
// DELETE /api/reviews/:id (Delete Review)
// -----------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: 'Review deleted successfully', review });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
});

module.exports = router;
