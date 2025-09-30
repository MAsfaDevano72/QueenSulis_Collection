const express = require('express');
const { registerUser, loginUser } = require('../controllers/authControllers');

const router = express.Router();

// Rute untuk registrasi dan login pengguna
router.post('/register', registerUser);
router.post('/login', loginUser);   

module.exports = router;