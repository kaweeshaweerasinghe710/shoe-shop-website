// server.js
require('dotenv').config(); // must be first so process.env is populated

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // parse application/json

// Mount routes (note: reviewRoutes requires the Review model)
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

//messageRoutes requires the Review model
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes)


//productRoutes requires the Review model
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

//cartRoutes requires the Review model
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// health check
app.get('/', (req, res) => res.send('API is running'));

// DB connection and server start
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || process.env.CONNECTION_URI;
console.log('Starting server. MONGO_URI defined?', Boolean(MONGO_URI));

if (!MONGO_URI) {
  console.error('❌ Missing MongoDB connection string. Set MONGO_URI in your .env or environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });
