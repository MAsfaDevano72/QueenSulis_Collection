const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); 

// FUNGSI 1: MEMBUAT PESANAN BARU (CUSTOMER)
exports.createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod, orderType } = req.body;
    
    // Asumsi: userId didapat dari token yang sudah diverifikasi di authMiddleware
    const userId = req.user.id; 

    if (!items || items.length === 0) {
        return res.status(400).json({ msg: 'Pesanan tidak boleh kosong.' });
    }

    try {
        let totalPrice = 0;
        const orderItems = [];
        
        // Loop melalui item untuk menghitung total harga dan memvalidasi stok (logika sederhana)
        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({ message: `Produk dengan ID ${item.productId} tidak ditemukan.` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stok produk ${product.name} tidak mencukupi.` });
            }

            // Hitung harga total berdasarkan harga saat ini di database
            totalPrice += product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price, // Simpan harga jual saat ini
            });
            
            // OPTIONAL: Kurangi stok produk setelah berhasil
            // product.stock -= item.quantity;
            // await product.save();
        }

        const newOrder = new Order({
            userId,
            items: orderItems,
            totalPrice,
            shippingAddress,
            paymentMethod,
            orderType,
            status: 'Menunggu Pembayaran', // Status awal
        });

        const order = await newOrder.save();
        res.status(201).json(order);

    } catch (err) {
        console.error("CREATE ORDER FATAL ERROR:", err.stack || JSON.stringify(err, null, 2));
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: "Gagal validasi pesanan: " + messages.join(', ') });
        }

        res.status(500).send('Server error saat membuat pesanan.');
    }
};

// FUNGSI 2: MENDAPATKAN SEMUA PESANAN (ADMIN)
exports.getOrders = async (req, res) => {
    const { status } = req.query; 
    let filter = {};
    if (status && status !== 'ALL') { 
        filter.status = status;
    }

    try {
        // Ambil semua pesanan, urutkan berdasarkan waktu terbaru, dan isi data user
        const orders = await Order.find(filter)
            .populate('userId', 'username email') // Tampilkan username & email user
            .sort({ orderedAt: -1 });
        
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error saat memuat pesanan.');
    }
};

// FUNGSI 3: UPDATE STATUS PESANAN (ADMIN)
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
        }
        
        order.status = status; 
        await order.save();
        
        res.json(order);

    } catch (err) {
        console.error("BACKEND UPDATE STATUS CRASH:", err); 
        res.status(500).send('Server error saat update status pesanan.');
    }
};

// FUNGSI 4: MENDAPATKAN RIWAYAT PESANAN (USER)
exports.getMyOrders = async (req, res) => {
    try {
        // Ambil semua pesanan yang dimiliki oleh user yang sedang login
        const orders = await Order.find({ userId: req.user.id }).sort({ orderedAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error saat memuat riwayat pesanan.');
    }
};