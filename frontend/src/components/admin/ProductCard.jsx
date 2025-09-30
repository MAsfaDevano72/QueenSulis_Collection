// src/components/admin/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onEditClick, onDeleteClick }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm flex flex-col justify-between bg-white">
            <div>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">Rp{product.price.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-500 mt-2">Stok: {product.stock}</p>
            </div>
            <div className="mt-4 flex space-x-2">
                <button 
                    onClick={() => onEditClick(product)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded-md hover:bg-yellow-600 text-sm"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDeleteClick(product._id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded-md hover:bg-red-600 text-sm"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
};

export default ProductCard;