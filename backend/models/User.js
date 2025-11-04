
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => /^\S+@\S+\.\S+$/.test(v),
      message: props => `${props.value} is not a valid email`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  numOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('User', userSchema);
