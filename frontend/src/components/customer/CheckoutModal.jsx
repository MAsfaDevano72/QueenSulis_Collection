// src/components/customer/CheckoutModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const paymentMethods = [
    { value: 'TRANSFER_BANK', label: 'Transfer Bank (Manual)' },
    { value: 'CASH_ON_DELIVERY', label: 'Bayar di Tempat (COD)' },
    { value: 'WHATSAPP_CONFIRMATION', label: 'Konfirmasi WhatsApp (Untuk Konveksi)' }
];

const orderTypes = [
    { value: 'READY_STOCK', label: 'Ready Stock' },
    { value: 'CUSTOM_KONVEKSI', label: 'Custom Konveksi' },
];


const CheckoutModal = ({ product, quantity, onClose }) => {
    const [formData, setFormData] = useState({
        customerName: '', 
        customerPhone: '',
        recipientName: '', 
        phoneNumber: '', 
        street: '', 
        city: '', 
        postalCode: '', 
        paymentMethod: paymentMethods[0].value,
    });
    
    // Tentukan order type berdasarkan properti produk
    const initialOrderType = product.isCustomizable ? 'CUSTOM_KONVEKSI' : 'READY_STOCK';
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const totalHarga = (product && product.price) 
        ? (product.price * quantity) 
        : 0; 
        
    const handleCheckout = async (e) => {
        e.preventDefault();

        // Validasi sederhana
        if (!formData.recipientName || !formData.phoneNumber || !formData.street) {
            return toast.error("Semua field alamat wajib diisi.");
        }

        try {
            const orderData = {
                customerName: formData.customerName, 
                customerPhone: formData.customerPhone,
                
                items: [{ 
                    productId: product._id, 
                    quantity: quantity 
                }],
                
                shippingAddress: {
                    recipientName: formData.recipientName,
                    phoneNumber: formData.phoneNumber,
                    street: formData.street,
                    city: formData.city,
                    postalCode: formData.postalCode,
                },
                
                paymentMethod: formData.paymentMethod,
                orderType: initialOrderType,
            };
            const res = await API.post('/orders', orderData);

            toast.success(`Pesanan #${res.data._id.slice(-6)} berhasil dibuat!`);
            onClose(); 
            
        } catch (err) {
            console.error("CHECKOUT ERROR:", err.response.data);
            const message = err.response?.data?.message || "Gagal membuat pesanan. Pastikan Anda sudah login.";
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-600"
                    aria-label="Tutup"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-[#8B7355] mb-4 border-b pb-2">Checkout Pesanan</h2>

                <div className="mb-6 p-4 bg-[#E6D5B8] rounded-md">
                    <h3 className="font-semibold text-lg text-[#3E3222]">{product.name}</h3>
                    <p className="text-sm text-[#8B7355]">Jumlah: {quantity} pcs</p>
                    <p className="font-bold text-xl mt-1 text-red-700">
                        Total: Rp{totalHarga.toLocaleString('id-ID')}
                    </p>
                </div>

                <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-3 text-lg text-[#C4A484]">Data Pemesan</h4>
                        <div className="space-y-4">
                            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Nama Pemesan" className="w-full px-3 py-2 border rounded-md" required />
                            <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="Nomor HP Pemesan" className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    </div>
                    {/* KOLOM 1: ALAMAT PENGIRIMAN */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-3 text-lg text-[#C4A484]">Alamat Pengiriman</h4>
                        <div className="space-y-4">
                            <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="Nama Penerima" className="w-full px-3 py-2 border rounded-md" required />
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Nomor Telepon Penerima" className="w-full px-3 py-2 border rounded-md" required />
                            <textarea name="street" value={formData.street} onChange={handleChange} placeholder="Nama Jalan & Nomor Rumah" className="w-full px-3 py-2 border rounded-md h-24" required />
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Kota/Kabupaten" className="w-full px-3 py-2 border rounded-md" required />
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Kode Pos" className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    </div>

                    {/* KOLOM 2: PEMBAYARAN & KONFIRMASI */}
                    <div>
                        <h4 className="font-bold mb-3 text-lg text-[#C4A484]">Metode Pembayaran</h4>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-6 bg-white" required>
                            {paymentMethods.map(method => (
                                <option key={method.value} value={method.value}>{method.label}</option>
                            ))}
                        </select>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            Tipe Pesanan: <span className="font-semibold">{orderTypes.find(t => t.value === initialOrderType).label}</span>
                        </p>

                        <p className="text-xs text-red-500 mb-8">
                            Pastikan data alamat dan kontak sudah benar sebelum melakukan checkout.
                        </p>

                        <div className="flex space-x-4">
                            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-semibold rounded-md bg-gray-300 hover:bg-gray-400">
                                Batal
                            </button>
                            <button type="submit" className="flex-1 py-3 text-sm font-semibold rounded-md text-white bg-[#C4A484] hover:bg-[#8B7355]">
                                KONFIRMASI PESANAN
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;