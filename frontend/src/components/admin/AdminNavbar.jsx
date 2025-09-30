// src/components/admin/AdminNavbar.jsx
import React from 'react';

const AdminNavbar = ({ onLogout }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-700">Dashboard Admin</h1>
            <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
                Logout
            </button>
        </header>
    );
};

export default AdminNavbar;