// src/components/admin/AdminLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header'; // Pastikan Header.jsx sudah dibuat
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        toast.info('Anda telah logout.');
    };

    return (
        // Hapus kelas dark:bg-gray-900
        <div className="flex h-screen bg-gray-50"> 
            <Sidebar />

            <div className="flex flex-col flex-1 w-full overflow-hidden">
                {/* Header/Navbar Atas */}
                <Header onLogout={handleLogout} />
                
                <main className="h-full overflow-y-auto">
                    <div className="container px-6 mx-auto grid">
                        {children} 
                    </div>
                </main>
            </div>
        </div>
    );  
};

export default AdminLayout;