import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

// Asumsi COLORS didefinisikan secara global atau diimpor
const COLORS = {
    BODY_BG: 'bg-[#FDF7F0]', // Background halaman
    CARD_BG: 'bg-white', // Background form login
    INPUT_BORDER: 'border-gray-300 focus:border-[#C4A484] focus:ring focus:ring-[#C4A484] focus:ring-opacity-50',
    BTN_PRIMARY_BG: 'bg-[#C4A484] hover:bg-[#A98E73]',
    TEXT_ACCENT: 'text-[#C4A484] hover:text-[#A98E73]',
    TEXT_DARK: 'text-[#3E3222]',
};


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            
            const decoded = jwtDecode(res.data.token);
            const userRole = decoded.user.role; 
            toast.success("Login berhasil!");

        if (userRole === 'admin') {
            navigate('/admin', { replace: true }); 
        } else {
            navigate('/', { replace: true }); 
        }

    } catch (err) {
        toast.error(err.response?.data?.message || "Login gagal.");
    }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${COLORS.BODY_BG} p-4`}>
            <div className={`w-full max-w-md p-8 rounded-xl shadow-xl ${COLORS.CARD_BG} text-center`}>
                <h1 className={`text-4xl font-serif font-bold mb-8 ${COLORS.TEXT_DARK}`}>
                    Good to see you again
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="sr-only">Your email</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                className={`block w-full pl-10 pr-3 py-2 border ${COLORS.INPUT_BORDER} rounded-md text-gray-900 placeholder-gray-400`}
                                placeholder="e.g. your_email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="sr-only">Your password</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                className={`block w-full pl-10 pr-3 py-2 border ${COLORS.INPUT_BORDER} rounded-md text-gray-900 placeholder-gray-400`}
                                placeholder="e.g. i_love_my_boutique123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white ${COLORS.BTN_PRIMARY_BG} transition-colors duration-200`}
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                {/* Links */}
                <div className="mt-6 flex items-center justify-between text-sm">
                    <Link to="/register" className={`font-medium ${COLORS.TEXT_ACCENT}`}>
                        Belum punya akun?
                    </Link>
                    <Link to="/forgot-password" className={`font-medium ${COLORS.TEXT_ACCENT}`}>
                        Lupa password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;