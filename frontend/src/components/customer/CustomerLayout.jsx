import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSearch, faUser, faShoppingCart, faHeart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const COLORS = {
    NAV_BG: 'bg-white', 
    BODY_BG: 'bg-[#F5F5DC]', // Beige
    TEXT_DARK: 'text-[#8B7355]', // Dark Taupe
    HIGHLIGHT: 'bg-[#C4A484] hover:bg-[#8B7355]', // Tan Brown
    FOOTER_BG: 'bg-[#3E3222]', // Espresso
};

const CustomerLayout = ({ children, showHero }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    const navigate = useNavigate();
    
    // Fungsi Logout
    const handleUserLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        toast.info("Anda telah logout.");
    };

    return (
        <div className={COLORS.BODY_BG}>
            {/* Navbar (fixed top) */}
            <header className={`sticky top-0 z-20 shadow-lg bg-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    
                    {/* KIRI: Search Icon */}
                    <button className={`${COLORS.TEXT_DARK} hover:text-[#C4A484] text-xl transition-colors duration-200`}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>

                    <Link to="/" className={`text-4xl font-serif font-bold ${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors`}>
                        QueenSulis_Collection
                    </Link>

                    <nav className="flex items-center space-x-6 text-lg font-medium">
                        {/* Menu Navigasi Utama */}
                        <Link to="/" className={`hidden lg:block ${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors duration-200`}>SHOP ALL</Link>
                        <Link to="/" className={`hidden lg:block ${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors duration-200`}>CATEGORY</Link>
                        <Link to="/about" className={`hidden lg:block ${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors duration-200`}>ABOUT</Link>
                        
                        {/* Icons Aksi */}
                        <div className="flex space-x-4 ml-8 text-xl">
                            {/* Wishlist Placeholder */}
                            <button className={`${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors`}>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>

                            {/* Profile / Riwayat Pesanan */}
                            {isAuthenticated ? (
                                // JIKA SUDAH LOGIN: Tampilkan Icon User Profile dan Tombol Logout
                                <>
                                    {/* Icon Profile/Riwayat */}
                                    <Link to="/profile/orders" title="Profil & Riwayat Pesanan" className={`${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors duration-200`}>
                                        <FontAwesomeIcon icon={faUser} />
                                    </Link>
                                    
                                    {/* Tombol Logout (Menggunakan Icon dan Fungsi onClick) */}
                                    <button
                                        onClick={handleUserLogout} // <-- Memanggil fungsi logout
                                        title="Logout"
                                        className={`text-white px-4 py-1 text-sm rounded transition-colors ${COLORS.HIGHLIGHT}`}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Logout
                                    </button>
                                </>
                            ) : (
                                // JIKA BELUM LOGIN: Tampilkan Tombol Login
                                <Link to="/login" title="Login" className={`text-white px-4 py-1 text-sm rounded transition-colors ${COLORS.HIGHLIGHT}`}>
                                    Login
                                </Link>
                            )}
                            
                            {/* Keranjang */}
                            <Link to="/cart" title="Keranjang Belanja" className={`${COLORS.TEXT_DARK} hover:text-[#C4A484] transition-colors duration-200`}>
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

             {showHero && (
                <div className="relative h-[70vh] bg-cover bg-center" // Tinggikan sedikit
                     style={{ backgroundImage: "url('https://www.marketeers.com/_next/image/?url=https%3A%2F%2Fimagedelivery.net%2F2MtOYVTKaiU0CCt-BLmtWw%2F70f81ae8-02f1-45ad-1a0b-e9df8829f300%2Fw%3D2507&w=1920&q=75')" }}> {/* Ganti dengan gambar Kebaya/Model yang Anda inginkan */}
                    
                    <div className="absolute inset-0 bg-opacity-10 flex items-center justify-start pl-16">
                        <div className="p-6">
                            {/* Judul Besar (Menggunakan Warna Espresso untuk Kontras) */}
                            <h1 className="text-8xl lg:text-9xl font-serif font-extrabold text-[#3E3222] mb-6 tracking-tight">
                                QueenSulis <br/> Collection
                            </h1>
                            
                            {/* Sub-Heading */}
                            <p className="text-2xl font-medium text-[#8B7355] mb-10">
                                Sentuhan Tradisi, Gaya Modern.
                            </p>
                            
                            {/* Button */}
                            <Link to="/shop" 
                                className={`inline-block px-8 py-3 text-lg font-semibold text-white rounded transition duration-300 ${COLORS.HIGHLIGHT} shadow-lg`}
                            >
                                Shop All Collection
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="min-h-[calc(100vh-16rem)]">
                {children}
            </main>

            {/* Footer */}
            <footer className={`${COLORS.FOOTER_BG} text-white p-10 mt-12`}>
                <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-sm">
                    {/* ... (Konten Footer) ... */}
                </div>
                <div className="text-center mt-8 text-xs text-gray-400 border-t border-gray-700 pt-4">
                    &copy; {new Date().getFullYear()} QueenSulis_Collection. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;