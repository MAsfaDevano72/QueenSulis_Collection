import React from 'react';

const OrderDetailModal = ({ order, onClose }) => {
    
    const getStatusClass = (status) => {
        // ... (Fungsi styling status yang sama dengan OrdersPage.jsx)
        switch (status) {
            case 'Selesai': return 'bg-green-100 text-green-700';
            case 'Sedang Diproses': return 'bg-yellow-100 text-yellow-700';
            case 'Dalam Perjalanan': return 'bg-blue-100 text-blue-700';
            case 'Dibatalkan': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                
                {/* Tombol Tutup */}
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-600">&times;</button>

                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Detail Pesanan #{order._id.slice(-6)}
                </h2>

                {/* Ringkasan Status & Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b pb-4">
                    <div>
                        <p className="font-medium text-gray-600">Status Saat Ini:</p>
                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-sm ${getStatusClass(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Total Pembayaran:</p>
                        <p className="text-xl font-extrabold text-purple-600">Rp{order.totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Data Pelanggan & Pengiriman */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                    {/* DATA PELANGGAN */}
                    <div>
                        <h3 className="font-bold mb-2 text-md text-gray-700">Data Pelanggan</h3>
                        <p>
                            Nama Pemesan: <strong>{order.shippingAddress.recipientName || 'N/A'}</strong> 
                        </p>
                        <p>
                            No.HP Pemesan: <strong>{order.shippingAddress.phoneNumber || 'N/A'}</strong>
                        </p>
                        <p>Email User: {order.userId.email}</p>
                    </div>
                    
                    {/* ALAMAT PENGIRIMAN */}
                    <div>
                        <h3 className="font-bold mb-2 text-md text-gray-700">Alamat Pengiriman</h3>
                        <p>Penerima: <strong> {order.shippingAddress.recipientName}</strong> </p>
                        <p>Telepon Penerima: {order.shippingAddress.phoneNumber}</p>
                        <p>Alamat: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    </div>
                </div>

                {/* Daftar Item Pesanan */}
                <h3 className="font-bold mt-6 mb-3 text-lg text-gray-700 border-t pt-4">Item Pesanan ({order.items.length})</h3>
                <ul className="space-y-3">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between p-2 bg-gray-50 rounded-md">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-medium">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;