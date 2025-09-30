// src/pages/customer/AboutUs.jsx
import React from 'react';
// Menggunakan warna dari palet Anda
const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#F5F5DC] p-8 flex justify-center items-center">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
                <h1 className="text-4xl font-serif font-bold text-[#8B7355] mb-6 border-b pb-2">Tentang Kami</h1>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                    QueenSulis_Collection & Konveksi.Bandung.48  didirikan dengan visi untuk menghadirkan keanggunan tradisional dan sentuhan modern dalam setiap jahitan. Kami percaya bahwa setiap wanita berhak merasa spesial, baik melalui kebaya *ready-to-wear* maupun gaun *custom* yang dirancang khusus.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    Layanan konveksi kami memastikan setiap detail, mulai dari pemilihan kain hingga fitting akhir, dikerjakan dengan presisi tinggi oleh penjahit profesional.
                </p>
                <div className="p-4 bg-[#E6D5B8] rounded-md text-[#3E3222] font-medium">
                    "Discover Your Elegance" - Sentuhan Personal dalam Setiap Kreasi.
                </div>
            </div>
        </div>
    );
};
export default AboutUs;