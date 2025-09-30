const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String, required: false },
    customerPhone: { type: String, required: false },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Harga saat item dipesan
    }],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
        recipientName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    status: { type: String, enum: ['Menunggu Pembayaran', 'Sedang Diproses', 'Dalam Perjalanan',  'Selesai', 'Dibatalkan'], default: 'Menunggu Pembayaran' },
    orderType: { type: String, enum: ['READY_STOCK', 'PRE_ORDER', 'CUSTOM_KONVEKSI'], required: true },
    paymentMethod: { type: String, enum: ['TRANSFER_BANK', 'PAYMENT_GATEWAY','CASH_ON_DELIVERY', 'WHATSAPP_CONFIRMATION'], required: true, },
    orderedAt: { type: Date, default: Date.now } 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;