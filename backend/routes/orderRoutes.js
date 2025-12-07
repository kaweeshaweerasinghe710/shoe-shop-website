const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// ✅ Create a new order (POST)
router.post('/', async (req, res) => {
  try {
    const { user, items, shippingAddress, totalPrice } = req.body;

    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: 'user and items are required' });
    }

    const order = new Order({ 
      user, 
      items, 
      shippingAddress,
      totalPrice 
    });
    
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// ✅ PayHere sandbox notify route (POST)
router.post('/notify', async (req, res) => {
  try {
    const data = req.body;

    // PayHere status_code 2 = payment successful
    if (data.status_code == 2) {
      const itemsArray = data.items.split(', ').map(name => ({
        name,
        qty: 1,
        price: data.amount
      }));

      const newOrder = new Order({
        user: data.customer_email || "guest",
        items: itemsArray,
        shippingAddress: {
          line1: data.address || data.shipping_address || "",
          line2: data.address2 || "",
          city: data.city || "",
          state: data.state || "",
          postalCode: data.zip || data.postal_code || "",
          country: data.country || "Sri Lanka"
        },
        totalPrice: data.amount,
        status: "paid"
      });

      await newOrder.save();
      console.log("Order saved via PayHere:", newOrder);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    res.status(500).send("Error");
  }
});

// ✅ Get all orders (GET)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// ✅ Get a single order by ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// ✅ Update order status (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Server error while updating order' });
  }
});

// ✅ Delete an order (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
});

module.exports = router;