// src/components/admin/EditProductModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useEffect } from 'react';


const EditProductModal = ({ product, onClose, onUpdateSuccess }) => {
    const imageLabels = { depan: 'Depan', samping: 'Samping', belakang: 'Belakang' };
    
    const [categories, setCategories] = useState([]); 
    
    const [editFormData, setEditFormData] = useState({
        name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, isCustomizable: product.isCustomizable,
    });
    const [editImageFiles, setEditImageFiles] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Gagal memuat kategori:", err);
                toast.error("Gagal memuat daftar kategori.");
            }
        };
        fetchCategories();
    }, []); 

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEditImageChange = (e) => {
        const { name, files } = e.target;
        setEditImageFiles((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        const imageKeys = ["depan", "samping", "belakang"];

        // Append data form teks
        for (const key in editFormData) {
            data.append(key, editFormData[key]);
        }

        // Tentukan urutan kunci file secara eksplisit
        product.images.forEach((url, index) => {
            data.append(`old_image_url_${index}`, url);
        }); // Hitung file yang benar-benar diunggah

        imageKeys.forEach((key, index) => {
            if (editImageFiles[key]) {
            // Kita beri nama unik agar backend tahu posisi file ini
            data.append(`new_image_${index}`, editImageFiles[key]);
        }
        });

        try {
            const res = await API.put(`/products/${product._id}`, data, {});
            
            onUpdateSuccess(res.data);
            toast.success("Produk berhasil diperbarui!");
            onClose();
        } catch (err) {
            console.error("EDIT ERROR:", err.response ? err.response.data : err.message);
            const errorMessage = err.response?.data?.message || "Gagal memperbarui produk.";
            toast.error(errorMessage);
        }
    };
    

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6 text-black">Edit Produk: {product.name}</h2>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                    {/* Form Inputs */}
                    {/* Input Nama */}
                    <input type="text" name="name" value={editFormData.name || ""} onChange={handleEditChange} placeholder="Nama Produk" className="px-3 py-2 border rounded-md" required />

                    {/* Input Harga */}
                    <input type="number" name="price" value={editFormData.price || ""} onChange={handleEditChange} placeholder="Harga" className="px-3 py-2 border rounded-md" required />

                    {/* Input Kategori */}
                    <select name="category" value={editFormData.category || ""} onChange={handleEditChange} className="px-3 py-2 border rounded-md" required>
                        {categories.length === 0 ? (
                            <option value="">-- Kategori tidak tersedia --</option>
                        ) : (
                            categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))
                        )}
                    </select>

                    {/* Input Stok */}
                    <input type="number" name="stock" value={editFormData.stock || ""} onChange={handleEditChange} placeholder="Stok" className="px-3 py-2 border rounded-md" required />

                    {/* Deskripsi */}
                    <div className="col-span-1 md:col-span-2">
                        <textarea name="description" value={editFormData.description || ""} onChange={handleEditChange} placeholder="Deskripsi Produk" className="w-full px-3 py-2 border rounded-md h-24" required></textarea>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="isCustomizable" checked={editFormData.isCustomizable || false} onChange={handleEditChange} />
                        <label className="text-gray-700">Produk Konveksi (Customizable)</label>
                    </div>
                    
                    {/* Image Inputs */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 border p-3 rounded-md">
                        <h3 className="col-span-full font-medium mb-2 border-b pb-2">Ganti Foto (Opsional)</h3>
                        
                        {["depan", "samping", "belakang"].map((key, index) => (
                            <div key={key} className="flex flex-col">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">
                                    {imageLabels[key]}
                                </label>
                                <div className="mb-2">
                                    <img 
                                        src={product.images[index] || 'placeholder-url'} 
                                        alt={`Gambar ${key} saat ini`} 
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                </div>
                                <input 
                                    type="file" 
                                    name={key} 
                                    onChange={handleEditImageChange} 
                                    className="w-full px-1 py-1 border rounded-md text-xs" 
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {editImageFiles[key] ? 'File Baru Siap Diunggah' : '*Kosongkan jika tidak ada perubahan.'}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                            Batal
                        </button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;