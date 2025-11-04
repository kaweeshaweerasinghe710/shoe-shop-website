// routes/shopRoutes.js
const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// ✅ GET - get shop details (if not exists, return empty object)
router.get('/', async (req, res) => {
  try {
    let shop = await Shop.findOne();
    if (!shop) {
      return res.json({ message: 'No shop found. Please create one.' });
    }
    res.json(shop);
  } catch (err) {
    console.error('GET /api/shop error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST - create new shop
router.post('/', async (req, res) => {
  try {
    const { name, address, phone, email, openingHours, social } = req.body;

    // check if shop already exists (only one shop)
    const existing = await Shop.findOne();
    if (existing) {
      return res.status(400).json({ message: 'Shop already exists. Use PUT to update.' });
    }

    const shop = new Shop({
      name,
      address,
      phone,
      email,
      openingHours,
      social: {
        facebook: social?.facebook || '',
        twitter: social?.twitter || '',
        instagram: social?.instagram || ''
      }
    });

    const savedShop = await shop.save();
    res.status(201).json(savedShop);
  } catch (err) {
    console.error('POST /api/shop error', err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT - update existing shop
router.put('/', async (req, res) => {
  try {
    const updateData = req.body;
    let shop = await Shop.findOne();

    if (!shop) {
      // If not exist, create new one
      shop = new Shop(updateData);
      await shop.save();
      return res.status(201).json(shop);
    }

    Object.assign(shop, updateData);
    await shop.save();
    res.json(shop);
  } catch (err) {
    console.error('PUT /api/shop error', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
