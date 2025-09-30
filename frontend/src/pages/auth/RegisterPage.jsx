// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

// Asumsi COLORS didefinisikan secara global atau diimpor
const COLORS = {
    BODY_BG: 'bg-[#FDF7F0]', // Background halaman (Warna Krem Terang)
    CARD_BG: 'bg-white', // Background form register
    INPUT_BORDER: 'border-gray-300 focus:border-[#C4A484] focus:ring focus:ring-[#C4A484] focus:ring-opacity-50',
    BTN_PRIMARY_BG: 'bg-[#C4A484] hover:bg-[#A98E73]', // Tan Brown
    TEXT_ACCENT: 'text-[#C4A484] hover:text-[#A98E73]',
    TEXT_DARK: 'text-[#3E3222]', // Espresso
};


const Register = () => {
    // Menambahkan state untuk SEMUA field yang akan dikirim
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // CATATAN: Logika validasi Confirm Password dihapus

        try {
            await API.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'user', // Role di-hardcode sebagai 'user'
            });

            toast.success('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Registrasi gagal. Coba lagi.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${COLORS.BODY_BG} p-4`}>
            <div className={`w-full max-w-md p-8 rounded-xl shadow-xl ${COLORS.CARD_BG} text-center`}>
                <h1 className={`text-4xl font-serif font-bold mb-8 ${COLORS.TEXT_DARK}`}>
                    Create Your Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                className={`block w-full pl-10 pr-3 py-2 border ${COLORS.INPUT_BORDER} rounded-md text-gray-900 placeholder-gray-400`}
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                className={`block w-full pl-10 pr-3 py-2 border ${COLORS.INPUT_BORDER} rounded-md text-gray-900 placeholder-gray-400`}
                                placeholder="e.g. your_email@example.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                className={`block w-full pl-10 pr-3 py-2 border ${COLORS.INPUT_BORDER} rounded-md text-gray-900 placeholder-gray-400`}
                                placeholder="Create a strong password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Tombol Submit */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white ${COLORS.BTN_PRIMARY_BG} transition-colors duration-200`}
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                {/* Link to Login */}
                <div className="mt-6 text-sm">
                    <Link to="/login" className={`font-medium ${COLORS.TEXT_ACCENT}`}>
                        Sudah punya akun? Login di sini.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;