import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const TestimonialModeration = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            // Mengambil SEMUA testimoni (termasuk yang isApproved: false)
            const res = await API.get('/testimonials'); 
            setTestimonials(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Gagal memuat daftar ulasan untuk moderasi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // FUNGSI UPDATE STATUS (Approve/Reject)
    const handleUpdateStatus = async (id, isApprovedStatus) => {
        try {
            // Panggil API PUT /api/testimonials/:id
            const res = await API.put(`/testimonials/${id}`, { isApproved: isApprovedStatus });

            // Perbarui state secara lokal
            setTestimonials(testimonials.map(t => 
                t._id === id ? res.data : t
            ));
            toast.success(`Ulasan berhasil ${isApprovedStatus ? 'disetujui' : 'ditolak'}.`);

        } catch (err) {
            console.error(err);
            toast.error('Gagal memperbarui status ulasan.');
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-lg">Memuat Data Moderasi...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 border-b pb-3">Moderasi Ulasan Pelanggan</h2>
            
            <div className="space-y-6">
                {testimonials.length === 0 ? (
                    <p className="text-center text-gray-500">Tidak ada ulasan untuk dimoderasi.</p>
                ) : (
                    testimonials.map((t) => (
                        <div key={t._id} className={`border p-4 rounded-lg shadow-sm ${t.isApproved ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className="font-bold text-lg text-gray-800">{t.userId.username} ({t.userId.email})</p>
                            <p className="text-sm text-gray-600">Rating: {t.rating} Bintang</p>
                            <p className="italic my-3 border-l-4 border-gray-300 pl-3">"{t.comment}"</p>
                            
                            <div className="flex items-center space-x-3 mt-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.isApproved ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                    Status: {t.isApproved ? 'DISETUJUI' : 'PENDING'}
                                </span>
                                
                                <button
                                    onClick={() => handleUpdateStatus(t._id, !t.isApproved)} // Toggle status
                                    className={`px-3 py-1 text-xs rounded-md text-white transition-colors duration-150 ${t.isApproved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                    {t.isApproved ? 'TOLAK' : 'SETUJUI'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TestimonialModeration;