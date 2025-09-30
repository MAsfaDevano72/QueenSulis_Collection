const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// mendapatkan data pengguna yang login
// dilindungi authMiddleware
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // req.user didapat dari middleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;