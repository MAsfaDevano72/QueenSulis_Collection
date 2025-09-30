// src/components/admin/Header.jsx
import React from 'react';

const Header = ({ onLogout }) => {
    return (
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
            <div className="container flex items-center justify-between h-full px-6 mx-auto">
                <div className="flex justify-center flex-1">
                    {/* Placeholder untuk Search Input (opsional) */}
                    <p className="text-gray-600 dark:text-gray-300">Selamat Datang di Admin Panel</p>
                </div>
                <ul className="flex items-center flex-shrink-0 space-x-6">
                    {/* Logout Button */}
                    <li>
                        <button
                            onClick={onLogout}
                            className="flex items-center text-sm font-medium leading-5 text-red-500 hover:text-red-700 transition-colors duration-150"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;