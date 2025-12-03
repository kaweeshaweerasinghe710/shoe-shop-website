const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get products by category with optional price filter
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query; // category slug + price range
    const query = {};

    // Filter by category if provided
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // case-insensitive
    } 

    // Filter by price range if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});




// Add a product
router.post('/', async (req, res) => {
  const { name, description, price, discount, countInStock, image, category } = req.body;
  try {
    const newProduct = new Product({ name, description, price,discount, countInStock, image, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product' });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
