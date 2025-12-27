require('dotenv').config();
const serverless = require('serverless-http');
const app = require('../backend/server'); // adjust path

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    "https://shoe-shop-website-two.vercel.app/",
    "https://shoe-shop-website-m48s.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());

// routes
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));

app.get('/', (req, res) => res.send('API is running'));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));


// Export the Express app for Vercel
module.exports = app;
