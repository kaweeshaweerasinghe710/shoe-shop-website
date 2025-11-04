// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get all items in cart
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.productId');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // check if product already exists in cart
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update quantity of a cart item
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    // Ensure a valid quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    item.quantity = quantity; // Update quantity
    await cart.save();

    res.json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete cart item by product ID
router.delete('/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      {},
      { $pull: { items: { productId: req.params.productId } } },
      { new: true }
    );
    res.json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
