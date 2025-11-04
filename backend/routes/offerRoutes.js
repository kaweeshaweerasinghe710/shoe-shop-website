const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new offer
router.post('/', async (req, res) => {
  const { offerType, product, discount } = req.body;

  try {
    const offer = new Offer({ offerType, product, discount });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an offer by ID
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an offer by ID
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
