// routes/orders.js
const express = require('express');
const { createOrder, getOrders, updateOrderStatus, getMyOrders } = require('../controllers/orderControllers');
const authMiddleware = require('../middleware/authMiddleware'); // Untuk semua yang butuh login
const adminAuth = require('../middleware/adminAuth'); // Untuk admin-only

const router = express.Router();

// Rute Publik/User (Perlu Login untuk membuat/melihat riwayat)
router.route('/')
    .post(authMiddleware, createOrder); // Customer membuat pesanan

router.route('/myorders')
    .get(authMiddleware, getMyOrders); // Customer melihat riwayat pesanan mereka

// Rute Admin (Hanya untuk monitoring/manajemen)
router.route('/')
    .get(authMiddleware, adminAuth, getOrders); // Admin melihat SEMUA pesanan

router.route('/:id/status')
    .put(authMiddleware, adminAuth, updateOrderStatus); // Admin update status

module.exports = router;