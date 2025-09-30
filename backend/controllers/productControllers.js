const Product = require('../models/Product');

const IMAGE_POSITIONS = ['new_image_0', 'new_image_1', 'new_image_2'];


// Get produk
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

// Get Produk by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({message: "Produk tidak ditemukan"});
        }
        res.status(200).json(product);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

// Membuat produk baru (hanya admin)
exports.createProduct = async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const { name, description, price, category, stock, isCustomizable } = req.body;

        if (imageUrls.length === 0) {
            return res.status(400).json({ msg: "Minimal 1 foto produk wajib diunggah." });
        }

        const newProduct = new Product({
            name, description, price, category, stock, isCustomizable, images: imageUrls
        });

        const product = await newProduct.save();
        // Mengembalikan objek produk yang baru dibuat
        res.status(201).json(product); 
    } catch (error) {
        console.error("CREATE PRODUCT FAILED. DETAILS:", error);
        
        // Tangani Mongoose Validation Error (Penyebab utama gagal tambah produk)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                msg: "Gagal validasi data: " + messages.join(', ') // Mengirim semua pesan validasi ke frontend
            }); 
        }

        res.status(500).send('Server error');
    }
};

// Mengupdate produk (hanya admin)
exports.updateProduct = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        const finalImages = [];
        
        for (let i = 0; i < 3; i++) {
            const fileKey = `new_image_${i}`;
            const urlKey = `old_image_url_${i}`;
            
            // Cek apakah ada file baru yang diupload untuk posisi ini
            if (req.files && req.files[fileKey] && req.files[fileKey][0]) {
                // Ada file baru: Gunakan URL dari file yang baru diupload
                finalImages[i] = req.files[fileKey][0].path;
            } else if (req.body[urlKey]) {
                // Tidak ada file baru, tapi ada URL lama: Gunakan URL lama
                finalImages[i] = req.body[urlKey];
            } else {
                // Posisi ini kosong (seharusnya tidak terjadi jika data lama lengkap)
                finalImages[i] = null;
            }
        }

        updatedData.images = finalImages.filter(url => url); 

        const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });

        res.json(product);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ 
                msg: "Gagal validasi data: " + messages.join(', ')
            }); 
        }
        res.status(500).send('Server error: ' + (err.message || 'Unknown error'));
    }
};



// Menghapus produk (hanya admin)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk dihapus' });
        console.log(`Produk dengan ID ${req.params.id} telah dihapus.`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};