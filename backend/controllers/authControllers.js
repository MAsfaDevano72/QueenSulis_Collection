const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const {username, email, password, role} = req.body;

    try {
        // Pengecekan jika user sudah ada
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({message: 'User already exists'});
        }

        // membuat instance user baru
        user = new User({
            username, email, password, role
        });

        // Hash password sebelum disimpan ke DB
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: { id: user.id, role: user.role}
        };

        jwt.sign (
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {
                if (err) throw err;
                req.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role} });
            }
        );

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // cek jika pengguna ada
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // cek password valid atau tidak
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: { id: user.id, role: user.role }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
            }
        )
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}