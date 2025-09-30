import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const CategoriesManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const fetchCategories = async () => {
        try {
            // Panggil API GET /api/categories
            const res = await API.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Gagal memuat kategori.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // FUNGSI TAMBAH KATEGORI BARU
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const res = await API.post('/categories', { name: newCategoryName, description: newCategoryDescription });
            setCategories([...categories, res.data]);
            setNewCategoryName('');
            setNewCategoryDescription('');
            toast.success(`Kategori "${res.data.name}" berhasil ditambahkan.`);
        } catch (err) {
            console.error(err.response);
            const msg = err.response?.data?.msg || 'Gagal menambahkan kategori.';
            toast.error(msg);
        }
    };

    // FUNGSI HAPUS KATEGORI
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            // Panggil API DELETE /api/categories/:id
            await API.delete(`/categories/${id}`);
            setCategories(categories.filter(cat => cat._id !== id));
            toast.success('Kategori berhasil dihapus.');
        } catch (err) {
            console.error(err);
            toast.error('Gagal menghapus. Pastikan tidak ada produk yang menggunakan kategori ini.');
        }
    };

    // FUNGSI UPDATE KATEGORI
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;

        try {
            // Panggil API PUT /api/categories/:id
            const res = await API.put(`/categories/${editingCategory._id}`, { name: editName, description: editDescription });
            
            // Update state categories
            setCategories(categories.map(cat => cat._id === editingCategory._id ? res.data : cat));
            
            setEditingCategory(null); // Tutup form edit
            toast.success('Kategori berhasil diperbarui.');
        } catch (err) {
            console.error(err);
            toast.error('Gagal memperbarui kategori.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manajemen Kategori</h2>
            
            {/* Form Tambah Kategori */}
            <form onSubmit={handleAddCategory} className="flex space-x-2 mb-6">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nama Kategori Baru"
                    className="flex-grow px-3 py-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="Deksripsi Kategori"
                    className="flex-grow px-3 py-2 border rounded-md"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Tambah
                </button>
            </form>

            {/* Daftar Kategori */}
            <div className="space-y-3">
                {categories.map((cat) => (
                    <div key={cat._id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                        {editingCategory && editingCategory._id === cat._id ? (
                            // Form Edit Inline
                            <form onSubmit={handleUpdate} className="flex-grow flex space-x-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-grow px-2 py-1 border rounded-md"
                                />
                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="flex-grow px-2 py-1 border rounded-md"
                                />
                                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Simpan</button>
                                <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500">Batal</button>
                            </form>
                        ) : (
                            // Tampilan Normal
                            <span className="font-medium text-gray-700">{cat.name}</span>
                        )}
                        
                        {!editingCategory && (
                            <div className="space-x-2">
                                <button
                                    onClick={() => { setEditingCategory(cat); setEditName(cat.name); setEditDescription(cat.description); }}
                                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesManager;