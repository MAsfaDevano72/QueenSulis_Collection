import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

// Definisikan status yang mungkin (sesuai ENUM di backend)
const STATUS_OPTIONS = ['Menunggu Pembayaran', 'Sedang Diproses', 'Dalam Perjalanan', 'Selesai', 'Dibatalkan'];

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url = filterStatus === 'ALL' ? '/orders' : `/orders?status=${filterStatus}`;
            const res = await API.get(url);
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Gagal memuat daftar pesanan.');
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (order) => {
        setSelectedOrder(order);
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Ubah status pesanan ${orderId.slice(-6)} menjadi ${newStatus}?`)) {
            return;
        }

        try {
            // Panggil API PUT /api/orders/:id/status
                const res = await API.put(`/orders/${orderId}/status`, { status: newStatus }); 

            // Perbarui state secara lokal
            setOrders(orders.map(order => 
                order._id === orderId ? res.data : order // Gunakan res.data
            ));
            toast.success(`Status pesanan ${orderId.slice(-6)} berhasil diperbarui.`);

        } catch (err) {
            console.error(err);
            toast.error('Gagal memperbarui status.');
        }
    };

    // Fungsi Pembantu untuk styling status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-green-100 text-green-700';
            case 'Sedang Diproses': return 'bg-yellow-100 text-yellow-700';
            case 'Dalam Perjalanan': return 'bg-blue-100 text-blue-700';
            case 'Dibatalkan': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-lg">Memuat Pesanan...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 border-b pb-3">Manajemen Pesanan</h2>
            
            {/* Filter Status */}
            <div className="mb-6 flex items-center space-x-3">
                <label className="text-gray-700 font-medium">Filter Status:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    <option value="ALL">Semua Status</option>
                    {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Tabel Pesanan */}
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                                <th className="px-4 py-3">ID Pesanan</th>
                                <th className="px-4 py-3">Pelanggan</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Tipe/Bayar</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {orders.map((order) => (
                                <tr key={order._id} 
                                    className="text-gray-700 cursor-pointer hover:bg-gray-50" >
                                    <td className="px-4 py-3 text-sm">{order._id.slice(-6)}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <p className="font-semibold">{order.userId.username}</p>
                                        <p className="text-xs text-gray-600">{order.userId.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm">Rp{order.totalPrice.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-xs">
                                        <p className="font-medium">{order.orderType}</p>
                                        <p className="text-xs text-gray-500">Bayar: {order.paymentMethod}</p>
                                    </td>
                                    
                                    {/* Kolom Status */}
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusClass(order.status)} text-xs`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    
                                    {/* Kolom Aksi */}
                                    <td className="px-4 py-3 text-sm">
                                        <select
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            defaultValue={order.status}
                                            className="border rounded-md p-1 text-xs focus:ring-purple-500"
                                        >
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleRowClick(order)} // Tombol ini yang memunculkan modal
                                            className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <div>
                            {selectedOrder && (
                                <OrderDetailModal
                                    order={selectedOrder}
                                    onClose={() => setSelectedOrder(null)}
                                />
                            )}
                        </div>
                    </table>
                </div>
            </div>
            
            {orders.length === 0 && <p className="mt-4 text-center text-gray-500">Tidak ada pesanan yang ditemukan untuk filter ini.</p>}

        </div>
    );
};

export default OrdersPage;