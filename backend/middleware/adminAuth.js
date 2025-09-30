const adminAuth = (req, res, next) => {
    
    if (req.user && req.user.role === 'admin') { // req.user.role didapat dari authmiddleware
        next();
    } else {
        res.status(403).json({ message: 'Hanya admin yang boleh masuk, akses anda ditolak!' });
    }
}

module.exports = adminAuth;