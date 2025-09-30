const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }

    try {
        let category = await Category.findOne({ name });
        if (category) {
        return res.status(400).json({ message: 'Kategori sudah ada.' });
        }

        category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Kategori
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });

        if (!category) {
        return res.status(404).json({ msg: 'Kategori tidak ditemukan.' });
        }
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
        return res.status(404).json({ msg: 'Kategori tidak ditemukan.' });
        }
        res.json({ msg: 'Kategori berhasil dihapus.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};