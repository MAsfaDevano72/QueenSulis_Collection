// src/components/admin/AddProduct.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useEffect } from 'react';

const AddProduct = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: "", description: "", price: "", category: "", stock: "", isCustomizable: false,
    });
    const [imageFiles, setImageFiles] = useState({
        depan: null, samping: null, belakang: null, 
    });

    const [categories, setCategories] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/categories');
                setCategories(res.data);

                if (res.data.length > 0) {
                    setFormData(prev => ({...prev, category: res.data[0]._id}));
                }
            } catch (error) {
                console.error('Gagal memuat kategori:', error);
                toast.error('Gagal memuat kategori.');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setImageFiles((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //memastikan kategori  produk dipilih
        if (!formData.category) {
            toast.error("Pilih kategori produk.");
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        
        let hasImage = false;
        const imageKeys = ['depan', 'samping', 'belakang'];
        imageKeys.forEach(key => {
            if (imageFiles[key]) {
                data.append("images", imageFiles[key]);
                hasImage = true;
            }
        });

        if (!hasImage) {
            toast.error("Upload minimal 1 foto");
            return;
        }

        try {
            const res = await API.post("/products", data, {});
            onProductAdded(res.data);
            toast.success("Produk berhasil ditambahkan!");
            
            // Reset form dan state
            setFormData({ name: "", description: "", price: "", 
                category: categories.length > 0 ? categories[0]._id : "", 
                stock: "", isCustomizable: false });
            setImageFiles({ depan: null, samping: null, belakang: null });
            document.getElementById('add-product-form').reset();
        } catch (err) {
            console.error(err);
            toast.error("Gagal menambahkan produk. Coba lagi.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tambah Produk Baru</h2>
            <form onSubmit={handleSubmit} id="add-product-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Inputs */}
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Produk" className="px-3 py-2 border rounded-md" required />
                
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Harga" className="px-3 py-2 border rounded-md" required />
                
                {/* Kategori */}
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md"
                    required
                >
                    {categories.length === 0 ? (
                        <option value="">-- Buat Kategori di bawah --</option>
                    ) : (
                        categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))
                    )}
                </select>

                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stok" className="px-3 py-2 border rounded-md" required />
                
                <div className="col-span-1 md:col-span-2">
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi Produk" className="w-full px-3 py-2 border rounded-md h-24" required></textarea>
                </div>
                {/* Checkbox */}
                <div className="flex items-center space-x-2">
                    <input type="checkbox" name="isCustomizable" checked={formData.isCustomizable} onChange={handleChange} />
                    <label className="text-gray-700">Produk Konveksi (Customizable)</label>
                </div>
                {/* Image Inputs */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["depan", "samping", "belakang"].map((key) => (
                        <div key={key}>
                            <label className="block text-gray-700 mb-1">
                                Tampak {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input type="file" name={key} onChange={handleImageChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    ))}
                </div>
                {/* Submit Button */}
                <div className="col-span-1 md:col-span-2">
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                        Tambah Produk
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;