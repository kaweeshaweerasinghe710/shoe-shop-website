const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import Review model or create fallback
let Review;
try {
  Review = require('../models/Review');
} catch {
  const reviewSchema = new mongoose.Schema({
    product: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    user: { type: String } // optional
  }, { timestamps: true });
  Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
}

// POST /api/reviews - create review
router.post('/', async (req, res) => {
  try {
    const { product, rating, comment, user } = req.body;

    if (!product || rating === undefined || !comment) {
      return res.status(400).json({ message: 'product, rating, and comment are required' });
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }

    const review = new Review({ product, rating: r, comment, user });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating review' });
  }
});

// GET /api/reviews - get all reviews
router.get('/', async (req, res) => {
  try {
    const { product, page = 1, limit = 20 } = req.query;
    const query = {};
    if (product) query.product = product;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

    const [data, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * perPage)
        .limit(perPage),
      Review.countDocuments(query)
    ]);

    res.json({ total, page: pageNum, perPage, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// GET /api/reviews/:id - get review by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching review' });
  }
});

// DELETE /api/reviews/:id - delete review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
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
