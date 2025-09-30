import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const isCustom = product.isCustomizable;
    const isStokAvailable = product.stock > 0;

    return (
        <div className="overflow-hidden">
            <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-xl truncate text-[#8B7355]">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                
                <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-2xl text-black">
                        Rp{product.price.toLocaleString('id-ID')}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isCustom ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {isCustom ? 'Konveksi' : 'Ready Stock'}
                    </span>
                </div>
                
                <Link 
                    to={`/product/${product._id}`} 
                    className={`mt-4 block w-full text-center font-semibold py-2 rounded-md ${isStokAvailable ? 'bg-[#C4A484] text-white hover:bg-[#8B7355]' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    onClick={(e) => !isStokAvailable && e.preventDefault()}
                >
                    {isStokAvailable ? 'Lihat Detail & Pesan' : 'Stok Habis'}
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;