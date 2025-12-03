const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart items
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne().populate("items.productId");
    if (!cart) return res.json({ items: [] });

    // Map productId to products for frontend
    const items = cart.items.map((item) => ({
      ...item.toObject(),
      products: item.productId, // key that frontend expects
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) cart = new Cart({ items: [] });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    const items = populatedCart.items.map((item) => ({
      ...item.toObject(),
      products: item.productId,
    }));

    res.status(201).json({ items });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update quantity
router.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Product not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    const items = populatedCart.items.map((item) => ({
      ...item.toObject(),
      products: item.productId,
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item
router.delete("/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    const items = populatedCart.items.map((item) => ({
      ...item.toObject(),
      products: item.productId,
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
