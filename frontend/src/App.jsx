// src/App.jsx (KODE YANG BENAR DAN FINAL)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

// Import Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import CustomerLayout from './components/customer/CustomerLayout'; // <--- PATH SUDAH BENAR
import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductDetail from './pages/customer/ProductDetail';
import OrderHistory from './pages/customer/OrderHistory';
import AboutUs from './pages/customer/AboutUs';

// Import Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductDashboard from "./pages/admin/ProductDashboard";
import CategoriesManager from './components/admin/CategoriesManager';
import OrdersPage from './pages/admin/OrdersPage'; 
import TestimonialModeration from './pages/admin/TestimonialModeration';


// Komponen untuk memeriksa otentikasi (Tetap Sama)
const ProtectedRoute = ({ element: Element, requiredRole }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.user.role;

        if (userRole === requiredRole) {
            return Element;
        } else {
            return <Navigate to="/" />;
        }
    } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* 1. Rute Otentikasi (TANPA LAYOUT) */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* 2. Rute Customer/Public (DENGAN CustomerLayout) */}
                <Route path="/" element={<CustomerLayout showHero={true}><HomePage /></CustomerLayout>} /> 
                <Route path="/product/:id" element={<CustomerLayout showHero={false}><ProductDetail /></CustomerLayout>} /> 
                <Route path="/about" element={<CustomerLayout showHero={false}><AboutUs /></CustomerLayout>} />
                
                {/* Rute Riwayat Pesanan (Private User) */}
                <Route path="/profile/orders" element={<ProtectedRoute element={<CustomerLayout showHero={false}><OrderHistory /></CustomerLayout>} requiredRole="user" />} />

                {/* 3. Rute Admin (DENGAN AdminLayout) */}
                <Route path="/admin" element={<ProtectedRoute element={<AdminLayout><AdminDashboard /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/products" element={<ProtectedRoute element={<AdminLayout><ProductDashboard /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/testimonials" element={<ProtectedRoute element={<AdminLayout><TestimonialModeration /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/categories" element={<ProtectedRoute element={<AdminLayout><CategoriesManager /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/orders" element={<ProtectedRoute element={<AdminLayout><OrdersPage /></AdminLayout>} requiredRole="admin" />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={2000} />
        </Router>
    );
};

export default App;