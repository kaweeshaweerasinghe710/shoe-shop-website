// models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'] // percentage = percent (0-100), fixed = fixed amount
  },
  product: {
    // storing product name as string (per your request)
    type: String,
    required: function() { return this.offerType !== 'sitewide'; }, // optional: require product for non-sitewide offers
    trim: true,
    default: ''
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  }
  });

// validate discount depending on offerType
offerSchema.pre('validate', function(next) {
  if (this.offerType === 'percentage') {
    if (this.discount < 0 || this.discount > 100) {
      return next(new Error('For percentage offers discount must be between 0 and 100'));
    }
  } else if (this.offerType === 'fixed') {
    if (this.discount < 0) {
      return next(new Error('For fixed offers discount must be >= 0'));
    }
  }
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
