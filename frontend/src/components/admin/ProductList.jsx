// src/components/admin/ProductList.jsx
import React from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import ProductCard from './ProductCard';

const ProductList = ({ products, onEditClick, onDeleteSuccess }) => {
    // Fungsionalitas Hapus Produk
    const handleDelete = async (productId) => {
        if (!window.confirm('Apakah anda yakin ingin menghapus produk ini?')) {
            return;
        }
        try {
            await API.delete(`/products/${productId}`);
            onDeleteSuccess(productId);
            toast.success('Produk berhasil dihapus.');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menghapus produk. Coba lagi.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Daftar Produk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <p className="text-gray-600">Tidak ada produk yang tersedia.</p>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEditClick={onEditClick}
                            onDeleteClick={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;