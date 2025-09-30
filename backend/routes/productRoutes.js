const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth'); 
const upload = require('../middleware/uploadMiddleware');  

const router = express.Router();

// rute publik
router.get('/', getProducts); 
router.get('/:id', getProductById);

// rute admin (hanya bisa diakses oleh role 'admin')
router.post('/', authMiddleware, adminAuth, upload.array('images', 4), createProduct); // tambah produk

// edit produk
router.put('/:id', 
    authMiddleware, 
    adminAuth, 
    upload.fields([
        { name: 'new_image_0', maxCount: 1 },
        { name: 'new_image_1', maxCount: 1 },
        { name: 'new_image_2', maxCount: 1 }
    ]), 
    updateProduct
);

router.delete('/:id', authMiddleware, adminAuth, deleteProduct); //hapus produk

module.exports = router;