// routes/business.js
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { auth, isAdmin } = require('../middleware/auth');

// Create new business (field users & admin)
router.post('/', auth, async (req, res) => {
    try {
        const business = new Business({
            ...req.body,
            createdBy: req.user._id
        });
        await business.save();
        res.status(201).json(business);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all businesses (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const businesses = await Business.find().populate('createdBy', 'username');
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get businesses by current user (field users)
router.get('/my-entries', auth, async (req, res) => {
    try {
        const businesses = await Business.find({ createdBy: req.user._id });
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export businesses as CSV (admin only)
router.get('/export', auth, isAdmin, async (req, res) => {
    try {
        const businesses = await Business.find().populate('createdBy', 'username');
        const csv = [
            'Business Name,Street,City,State,Zip,Email,Contact Name,Phone,Created By',
            ...businesses.map(b => 
                `${b.businessName},${b.physicalAddress.street},${b.physicalAddress.city},` +
                `${b.physicalAddress.state},${b.physicalAddress.zipCode},${b.emailAddress},` +
                `${b.contactName},${b.phoneNumber},${b.createdBy.username}`
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=businesses.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;