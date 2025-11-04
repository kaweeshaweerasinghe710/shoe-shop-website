// models/Shop.js
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: {
      validator: v => v === '' || /^\S+@\S+\.\S+$/.test(v),
      message: props => `${props.value} is not a valid email`
    }
  },
  openingHours: { type: String, trim: true, default: '' }, // e.g. "Mon-Fri 9:00-18:00"
  social: {
    facebook: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
