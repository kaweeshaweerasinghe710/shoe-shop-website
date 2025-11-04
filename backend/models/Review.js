const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',        // if you have a Product model; otherwise store product id as string
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    required: true
  },
  // optional: track user who made the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
