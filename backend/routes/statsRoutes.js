const express = require('express');
const { getAdminStats } = require('../controllers/statsControllers');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/stats', authMiddleware, adminAuth, getAdminStats);

module.exports = router;