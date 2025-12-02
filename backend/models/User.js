const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },

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

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'manager', 'admin'], 
    default: 'user'   // signup users = customers only
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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
