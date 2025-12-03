const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  countInStock: { type: Number, default: 0 },
  image: { type: String },
  category: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
