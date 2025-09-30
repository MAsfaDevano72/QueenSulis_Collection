// middleware/upload.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi Cloudinary menggunakan kredensial dari .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'queenSulis_Collection', // Nama folder di Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg', "webp"], // Format file yang diizinkan
    },
});

const upload = multer({ storage });

module.exports = upload;