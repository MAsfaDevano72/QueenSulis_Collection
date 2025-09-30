import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api/axios";

// Import komponen yang sudah dipisahkan
import AdminNavbar from "../../components/admin/AdminNavbar";
import AddProduct from "../../components/admin/AddProduct";
import ProductList from "../../components/admin/ProductList";
import EditProductModal from "../../components/admin/EditProductModal";
import CategoriesManager from "../../components/admin/CategoriesManager";

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fungsi fetchProducts (dipakai saat awal dan saat update berhasil)
    const fetchProducts = async () => {
        try {
            const res = await API.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat produk.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     navigate("/login");
    //     toast.info("Anda telah logout.");
    // };

    // Fungsi untuk menambah produk ke state setelah berhasil submit
    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
    };

    // Fungsi untuk menghapus produk dari state
    const handleProductDeleted = (productId) => {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
    };

    // Fungsi untuk memperbarui produk di state
    const handleProductUpdated = (updatedProduct) => {
        setProducts((prev) => prev.map(p => 
            p._id === updatedProduct._id ? updatedProduct : p
        ));
    };

    // Fungsi Buka/Tutup Modal Edit
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
    };

    return (
    <>
        {/* Konten akan di-inject ke dalam <div className="container px-6 mx-auto grid"> di AdminLayout */}
        
        <h2 className="my-6 text-2xl font-semibold text-gray-900">
            Manajemen Produk
        </h2>
        
        {/* 1. Komponen Tambah Produk */}
        <AddProduct onProductAdded={handleProductAdded} />

        {/* 2. Komponen Daftar Produk */}
        <ProductList 
            products={products}
            onEditClick={handleEditClick}
            onDeleteSuccess={handleProductDeleted}
        />
        
        {/* 3. Komponen Modal Edit */}
        {isEditModalOpen && (
            <EditProductModal
                product={editingProduct}
                onClose={handleCloseModal}
                onUpdateSuccess={handleProductUpdated}
            />
        )}
    </>
);
};

export default ProductDashboard;