// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { OrderStatusChart, TopProductsChart, STATUS_COLORS_MAP } from '../../components/admin/Charts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalCategories: 0,
        pendingOrders: 0,
        lowStockItems: 0,
    });
    const [loading, setLoading] = useState(true);

    const getStatusChartData = () => {
        const counts = stats.orderStatusCounts.map(item => item.count);
        const labels = stats.orderStatusCounts.map(item => STATUS_COLORS_MAP[item._id]?.label || item._id); // Menggunakan label yang sesuai
        const backgroundColors = stats.orderStatusCounts.map(item => STATUS_COLORS_MAP[item._id]?.color || '#9CA3AF'); 

        return { counts, labels, backgroundColors }; // Mengembalikan warna juga
    };

    const getTopProductsChartData = () => {
        const labels = stats.topSellingProducts.map(item => item.productName);
        const data = stats.topSellingProducts.map(item => item.totalSold);
        return { labels, data };
    };

    // Fungsi untuk mengambil data ringkasan metrik dari backend
    const fetchStats = async () => {
        setLoading(true);
        try {
            // Panggil API baru
            const res = await API.get('/admin/stats');
            setStats(res.data); // Data nyata dari backend
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat statistik dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const MetricCard = ({ title, value, icon, color }) => (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className={`p-3 mr-4 text-${color}-500 bg-${color}-100 rounded-full`}>
                {icon}
            </div>
            <div>
                <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
                <p className="text-lg font-semibold text-gray-700">{value}</p>
            </div>
        </div>
    );
    
    if (loading) {
        return <div className="p-6 text-center">Memuat Dashboard...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="my-6 text-2xl font-semibold text-gray-700">Ringkasan Dashboard</h2>

            {/* CARD METRIK */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard 
                    title="Total Pendapatan"
                    value={`Rp${stats.totalRevenue.toLocaleString('id-ID')}`}
                    color="purple"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path></svg>}
                />
                <MetricCard 
                    title="Total Produk"
                    value={stats.totalProducts}
                    color="blue"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
                />
                <MetricCard 
                    title="Kategori"
                    value={stats.totalCategories}
                    color="teal"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
                />
                <MetricCard 
                    title="Pesanan Menunggu"
                    value={stats.pendingOrders}
                    color="orange"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>}
                />
                <MetricCard 
                    title="Stok Rendah (< 5)"
                    value={stats.lowStockItems}
                    color="red"
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>}
                />
            </div>
            
            {/* GRAFIK DAN PESANAN TERBARU (Placeholder) */}
            <h3 className="my-6 text-xl font-semibold text-gray-700">Pesanan Terbaru & Grafik</h3>
            <div className="grid gap-6 mb-8 md:grid-cols-2">
                
                {/* CHART 1: STATUS PESANAN (Doughnut Chart) */}
                <OrderStatusChart 
                    chartData={getStatusChartData()} 
                />

                {/* CHART 2: PRODUK TERLARIS (Bar Chart) */}
                <TopProductsChart 
                    chartData={getTopProductsChartData()} 
                />
            </div>

        </div>
    );
};

export default AdminDashboard;