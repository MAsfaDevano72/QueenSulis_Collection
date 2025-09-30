// src/App.jsx
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductDashboard from "./pages/admin/ProductDashboard";
import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminLayout from './components/admin/AdminLayout'; 
import CategoriesManager from './components/admin/CategoriesManager';
import OrdersPage from './pages/admin/OrdersPage';  
import ProductDetail from './pages/customer/ProductDetail';
import OrderHistory from './pages/customer/OrderHistory';
import AboutUs from './pages/customer/AboutUs';
import CustomerLayout from './pages/customer/CustomerLayout';
import TestimonialModeration from './pages/admin/TestimonialModeration';


// Komponen untuk memeriksa otentikasi
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
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
    }
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product/:id" element={<ProductDetail />} /> 

                <Route path="/" element={<CustomerLayout showHero={true}><HomePage /></CustomerLayout>} /> 
                <Route path="/product/:id" element={<CustomerLayout showHero={false }><ProductDetail /></CustomerLayout>} /> 
                <Route path="/about" element={<CustomerLayout><AboutUs /></CustomerLayout>} />

                <Route path="/profile/orders" element={<ProtectedRoute element={<OrderHistory />} requiredRole="user" />} />

                {/*--- Rute Admin ---*/}
                <Route path="/admin" element={<ProtectedRoute element={<AdminLayout><AdminDashboard /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/products" element={<ProtectedRoute element={<AdminLayout><ProductDashboard /></AdminLayout>} requiredRole="admin" />} />
                <Route path="/admin/testimonials" element={<ProtectedRoute element={<AdminLayout><TestimonialModeration /></AdminLayout>} requiredRole="admin" />} />
                {/* Manajemen Kategori */}
                <Route path="/admin/categories" element={<ProtectedRoute element={<AdminLayout><CategoriesManager /></AdminLayout>} requiredRole="admin" />} />
                {/* Manajemen Pesanan */}
                <Route path="/admin/orders" element={<ProtectedRoute element={<AdminLayout><OrdersPage /></AdminLayout>} requiredRole="admin" />} />

                
            </Routes>
            <ToastContainer position="top-right" autoClose={2000} />
        </Router>
    );
};

export default App;
