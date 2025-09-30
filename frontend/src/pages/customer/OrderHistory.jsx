import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderHistory = async () => {
        try {
            // Memanggil API untuk mendapatkan riwayat pesanan user yang sedang login
            const res = await API.get('/orders/myorders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Gagal memuat riwayat pesanan. Silakan login kembali.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-700';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700';
            case 'CANCELED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-[#F5F5DC]">Memuat Riwayat...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5DC] p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
                <h1 className="text-3xl font-bold text-[#8B7355] mb-6 border-b pb-3">Riwayat Pesanan Saya</h1>
                
                {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Anda belum memiliki riwayat pesanan.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border p-4 rounded-lg bg-[#E6D5B8] shadow-sm">
                                <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <h3 className="font-semibold text-lg text-[#3E3222]">
                                        Pesanan ID: #{order._id.slice(-6)}
                                    </h3>
                                    <span className={`px-3 py-1 font-semibold leading-tight rounded-full ${getStatusClass(order.status)} text-sm`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[#8B7355] mb-2">Tgl Pesan: {new Date(order.orderedAt).toLocaleDateString()}</p>
                                
                                <ul className="list-disc list-inside ml-4 text-gray-700">
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.name} ({item.quantity} pcs) - @Rp{item.price.toLocaleString('id-ID')}
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-3 font-bold text-xl text-red-700">
                                    Total: Rp{order.totalPrice.toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;