const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Menunggu Pembayaran' });
        const lowStockItems = await Product.countDocuments({ stock: { $lte: 5 } });

        const orderStatusCounts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const topSellingProducts = await Order.aggregate([
            // Memisahkan array items menjadi dokumen terpisah
            { $unwind: "$items" },
            // Mengelompokkan berdasarkan produkID dan menjumlahkan kuantitas
            { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" }, productName: { $first: "$items.name" } } },
            // Mengurutkan dari yang paling banyak terjual
            { $sort: { totalSold: -1 } },
            // Batasi 5 teratas
            { $limit: 5 }
        ]);
        
        const totalRevenueResult = await Order.aggregate([
            { $match: { status: 'Selesai' } }, 
            { $group: { 
                _id: null, 
                totalRevenue: { $sum: { $toDouble: "$totalPrice" } } 
            } }
        ]);
        
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

        res.json({
            // Metrik Dasar
            totalProducts,
            totalCategories,
            pendingOrders,
            lowStockItems,
            totalRevenue, 
            
            // Data Chart
            orderStatusCounts,
            topSellingProducts, 
        });

    } catch (err) {
        console.error("STATS FETCH ERROR:", err);
        res.status(500).send('Gagal memuat statistik admin.');
    }
};