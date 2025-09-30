// src/pages/customer/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const isAuthenticated = localStorage.getItem('token') !== null; 

const Testimonials = () => {
    const [publicTestimonials, setPublicTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ review: '', rating: 5 }); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTestimonials = async () => {
            try {
                const res = await API.get('/testimonials/public'); 
                setPublicTestimonials(res.data);
            } catch (error) {
                console.error(error);
                toast.error('Gagal memuat ulasan.');
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { // <-- Logika cek otentikasi
        return toast.warn("Anda harus login untuk mengirimkan ulasan.");
    }
    // ... (Validasi & logic lainnya)

    setIsSubmitting(true);
    try {
        // Panggilan API ini sekarang akan membawa token valid
        await API.post('/testimonials', { 
            review: formData.review, 
            rating: parseInt(formData.rating) 
        });

        toast.success("Ulasan Anda berhasil dikirim! Akan ditampilkan setelah dimoderasi oleh admin.");
        // ...
    } catch (err) {
        console.error(err);
        toast.error("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
        setIsSubmitting(false);
    }
};

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-[#F5F5DC]">Memuat Ulasan...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5DC] p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-4xl font-serif font-bold text-[#8B7355] mb-8 border-b pb-2">Ulasan Pelanggan</h1>
                
                {/* FORM SUBMISSION */}
                <div className="mb-10 p-6 border rounded-lg bg-[#E6D5B8]">
                    <h2 className="text-2xl font-semibold text-[#3E3222] mb-4">Bagikan Pengalaman Anda</h2>
                    <form onSubmit={handleSubmitTestimonial}>
                        <div className="mb-4">
                            <label className="block text-[#8B7355] font-medium mb-1">Rating (1-5)</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Bintang</option>)}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#8B7355] font-medium mb-1">Ulasan Anda</label>
                            <textarea
                                name="review"
                                value={formData.review}
                                onChange={handleFormChange}
                                placeholder="Tuliskan ulasan Anda mengenai produk dan pelayanan kami..."
                                className="w-full px-3 py-2 border rounded-md h-24"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !isAuthenticated}
                            className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${isAuthenticated ? 'bg-[#C4A484] hover:bg-[#8B7355]' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {isSubmitting ? 'Mengirim...' : (isAuthenticated ? 'Kirim Ulasan' : 'Login untuk Mengirim Ulasan')}
                        </button>
                    </form>
                </div>

                {/* LIST PUBLIC TESTIMONIALS (ASUMSI user di backend memiliki field username) */}
                <h2 className="text-3xl font-bold text-[#3E3222] mb-6">Ulasan Terverifikasi</h2>
                <div className="space-y-6">
                    {publicTestimonials.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Belum ada ulasan terverifikasi.</p>
                    ) : (
                        publicTestimonials.map((t) => (
                            <div key={t._id} className="border p-4 rounded-md bg-gray-50">
                                <p className="font-bold text-[#C4A484]">{t.userId?.username || 'Pelanggan'}</p>
                                <div className="text-yellow-500 text-sm mt-1">
                                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                                </div>
                                <p className="text-gray-700 italic mt-2">"{t.review}"</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;