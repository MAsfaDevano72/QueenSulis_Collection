const express = require('express');
const {
    submitTestimonial,
    getApprovedTestimonials,
    getAllTestimonials,
    updateTestimonialStatus,
} = require('../controllers/testimonialControllers');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/public', getApprovedTestimonials);

// Rute Private (submit)
router.post('/', authMiddleware, submitTestimonial);

// Rute Admin
router.get('/', authMiddleware, adminAuth, getAllTestimonials);
router.put('/:id', authMiddleware, adminAuth, updateTestimonialStatus);


module.exports = router;