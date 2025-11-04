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
    const cart = new Cart({ items: [{ productId, quantity }] });
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
