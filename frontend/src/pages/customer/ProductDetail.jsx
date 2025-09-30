// src/pages/customer/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import API from '../../api/axios';
import CheckoutModal from '../../components/customer/CheckoutModal';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal checkout
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Produk tidak ditemukan atau gagal dimuat.');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    const isAuthenticated = localStorage.getItem('token') !== null; 
    const handleOrderWebsite = () => {
        if (!isStokAvailable) {
            return toast.error("Stok Habis!");
        }
        
        if (!isAuthenticated) {
            toast.warn("Anda harus login untuk melanjutkan Order via Website.");
            return navigate('/login'); // Arahkan ke Login
        }

        // Buka Modal jika authenticated
        setIsModalOpen(true); 
    };

    // Fungsi untuk Order via WhatsApp
    const handleOrderWhatsApp = () => {
        if (!product) return;

        const total = quantity * product.price;
        const totalFormatted = total.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
        const message = `Halo Admin QueenSulis_Collection,\n\nSaya tertarik dengan produk:\n- Nama Produk: ${product.name}\n- Kode Produk: ${product._id.slice(-6)}\n- Harga: Rp${product.price.toLocaleString('id-ID')}\n- Jumlah: ${quantity} pcs\n- Total: Rp.${totalFormatted}\n\nMohon informasi lebih lanjut mengenai pemesanan. Terima kasih.`;
        
        // Ganti nomor ini dengan nomor WhatsApp Admin Anda
        const adminWA = '6288212925132'; 
        const url = `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    
    // Fungsi untuk menentukan apakah ada stok
    const isStokAvailable = product && product.stock > 0;

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center text-xl bg-[#F5F5DC]">Memuat Produk...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex justify-center items-center text-xl bg-[#F5F5DC] text-[#8B7355]">Produk tidak ditemukan.</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5DC] p-8">
            <button 
                onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
                className="fixed top-4 right-4 text-3xl font-bold text-[#8B7355] hover:text-red-600 z-50 p-2 bg-white rounded-full shadow-lg"
                aria-label="Kembali"
            >
                &times;
            </button> 
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* GALLERY GAMBAR */}
                    <div className="space-y-4">
                        {/* Gambar Utama (Thumbnail) */}
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                        />
                        {/* Gambar Pendukung */}
                        <div className="grid grid-cols-3 gap-2">
                            {product.images.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt={`Tampilan ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-md cursor-pointer border border-gray-200"
                                    // Di sini bisa ditambahkan logika untuk mengganti gambar utama
                                />
                            ))}
                        </div>
                    </div>

                    {/* DETAIL PRODUK & OPSI PEMESANAN */}
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-[#8B7355] border-b pb-2 mb-4">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-bold text-black mb-6">
                            Rp{product.price.toLocaleString('id-ID')}
                        </p>
                        
                        <div className="text-gray-700 mb-6 space-y-3">
                            <p className="text-lg">
                                <span className="font-semibold text-[#8B7355]">Kategori:</span> {product.category}
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold text-[#8B7355]">Tipe:</span> {product.isCustomizable ? 'Konveksi Custom' : 'Ready Stock'}
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold text-[#8B7355]">Stok:</span> 
                                <span className={`ml-2 font-bold ${isStokAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {isStokAvailable ? `${product.stock} Tersedia` : 'Habis'}
                                </span>
                            </p>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed border-t pt-4">
                            {product.description}
                        </p>
                        
                        {/* QUANTITY PICKER */}
                        <div className="flex items-center space-x-4 mb-8">
                            <label className="text-lg font-semibold text-[#8B7355]">Jumlah:</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                className="w-20 px-3 py-2 border rounded-md text-center focus:ring-[#C4A484] focus:border-[#C4A484]"
                                disabled={!isStokAvailable}
                            />
                        </div>

                        {/* OPSI PEMESANAN */}
                        <div className="flex space-x-4">
                            {/* Order by Website (Checkout) */}
                            <button
                                onClick={handleOrderWebsite} // Panggil fungsi cek auth
                                className={`flex-1 px-6 py-3 font-semibold rounded-lg text-white transition duration-300 ${isStokAvailable ? 'bg-[#C4A484] hover:bg-[#8B7355]' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!isStokAvailable}
                            >
                                ORDER VIA WEBSITE
                            </button>
                            
                            {/* Order by WhatsApp */}
                            <button
                                onClick={handleOrderWhatsApp}
                                className="flex-1 px-6 py-3 font-semibold rounded-lg text-white transition duration-300 bg-green-500 hover:bg-green-600"
                            >
                                ORDER VIA WHATSAPP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal Checkout */}
            {isModalOpen && (
                <CheckoutModal 
                    product={product}
                    quantity={quantity}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProductDetail;