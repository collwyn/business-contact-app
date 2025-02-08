// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user with that id
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Add user to request object
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { auth, isAdmin };