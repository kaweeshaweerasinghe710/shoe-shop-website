// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // store user id or guest identifier
  items: { type: [orderItemSchema], required: true },
  shippingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  totalPrice: { type: Number, default: 0 },
  status: { type: String, default: 'pending' } // pending, paid, shipped, delivered, cancelled
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
