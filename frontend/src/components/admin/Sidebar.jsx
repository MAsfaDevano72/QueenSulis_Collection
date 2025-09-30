// src/components/admin/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Produk', path: '/admin/products', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }, // <-- PATH DIPERBARUI
        { name: 'Kategori', path: '/admin/categories', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { name: 'Pesanan', path: '/admin/orders', icon: 'M3 3h2l.4 2M7 13h10l1.6-6H6.4M7 13L6 6m12 7h-2M8 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z' },
        { name: 'Testimoni', path: '/admin/testimonials', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    ];

    return (
        // Hapus kelas dark:
        <aside className="z-20 hidden w-64 overflow-y-auto bg-white md:block flex-shrink-0">
            <div className="py-4 text-gray-500">
                <a className="ml-6 text-lg font-bold text-gray-800" href="/admin">
                    QueenSulis_Admin
                </a>
                <ul className="mt-6">
                    {menuItems.map((item) => (
                        <li className="relative px-6 py-3" key={item.name}>
                            <NavLink
                                to={item.path}
                                end
                                className={({ isActive }) => 
                                    `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                                        isActive
                                            ? 'text-gray-800' // Kelas untuk teks aktif
                                            : 'hover:text-gray-800'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <React.Fragment>
                                        {isActive && (
                                            <span 
                                                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" 
                                                aria-hidden="true"
                                            ></span>
                                        )}
                                        {item.icon}
                                        <span className="ml-4">{item.name}</span>
                                    </React.Fragment>
                                )}
                                
                                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d={item.icon}></path>
                                </svg>
                                <span className="ml-4">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Hapus Tombol Create Account di Sidebar */}
        </aside>
    );
};

export default Sidebar;

