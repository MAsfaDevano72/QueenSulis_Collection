// src/pages/customer/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import CustomerLayout from '../../pages/customer/CustomerLayout';
import ProductCard from '../../components/customer/ProductCard'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; 


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products');
            const all = res.data;
            setProducts(all);
            setFeaturedProducts(all.slice(0, 6)); 
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Gagal memuat katalog produk.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <CustomerLayout showHero={true}><div className="text-center p-12 text-[#8B7355]">Memuat Produk...</div></CustomerLayout>;
    }

    return (
        <div className="container mx-auto py-12 px-8"> 
            
            {/* Bagian 1: Featured Collection (Carousel Horizontal) */}
            <h2 className="text-4xl font-serif font-bold text-[#8B7355] mb-6 text-center">
                Koleksi Pilihan Kami
            </h2>
             <div className="relative p-4"> {/* Tambahkan padding untuk menampung panah */}
                    <Swiper
                        // Konfigurasi modul (WAJIB diimport di atas)
                        modules={[Navigation, Pagination]}
                        
                        // Opsi Navigasi (Panah Kiri/Kanan)
                        navigation={true} 
                        
                        slidesPerView={3}
                        spaceBetween={24} 
                        
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 30 }, // Tampilkan 4 card di layar desktop
                        }}
                        className="mySwiper"
                    >
                        {featuredProducts.map((product) => (
                            <SwiperSlide key={product._id} className="bg-[#E6D5B8] rounded-lg shadow-xl overflow-hidden">
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            {/* Bagian 2: About Us Short Story */}
            <div className="my-16 py-12 px-10 bg-white rounded-lg shadow-lg text-center border-t border-b border-[#C4A484]">
                <h3 className="text-3xl font-serif font-bold text-[#8B7355] mb-4">
                    Sentuhan Personal dalam Setiap Kreasi
                </h3>
                <p className="text-gray-700 max-w-3xl mx-auto">
                    Butik kami menghadirkan perpaduan sempurna antara keindahan kebaya tradisional dan gaya modern. Kami berkomitmen untuk kualitas tinggi, presisi jahitan, dan desain yang benar-benar mewakili keanggunan Anda.
                </p>
                <Link to="/about" className="mt-6 inline-block text-[#C4A484] hover:text-[#8B7355] font-semibold underline">
                    Baca Kisah Kami Selengkapnya &rarr;
                </Link>
            </div>
            
            {/* Bagian 3: Daftar Semua Produk Lainnya (Opsional) */}
            <h2 className="text-4xl font-serif font-bold text-[#8B7355] mb-8 border-b pb-3">
                Seluruh Koleksi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

        </div>
    );
};

export default HomePage;