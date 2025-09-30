const Testimonial = require('../models/Testimonial');

exports.submitTestimonial = async (req, res) => {
    const { comment, rating } = req.body;
    // req.user.id datang dari authMiddleware
    const userId = req.user.id; 

    try {
        const newTestimonial = new Testimonial({
            userId,
            comment,
            rating,
        });

        await newTestimonial.save();
        res.status(201).json({ msg: 'Ulasan berhasil dikirim dan akan dimoderasi.' });
    } catch (err) {
        console.error("SUBMIT TESTIMONIAL ERROR:", err);
        res.status(500).send('Gagal mengirim ulasan.');
    }
};

exports.getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isApproved: true })
            .populate('userId', 'username') 
            .sort({ submittedAt: -1 });
        
        res.json(testimonials);
    } catch (err) {
        res.status(500).send('Gagal memuat ulasan publik.');
    }
};

// 3. GET /api/testimonials (Private - Admin moderation)
exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate('userId', 'username email').sort({ submittedAt: -1 });
        res.json(testimonials);
    } catch (err) { res.status(500).send('Gagal memuat daftar ulasan.'); }
};

// 4. PUT /api/testimonials/:id (Private - Admin approves)
exports.updateTestimonialStatus = async (req, res) => {
    const { isApproved } = req.body;
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { isApproved: isApproved }, { new: true });
        if (!testimonial) { return res.status(404).json({ msg: 'Ulasan tidak ditemukan.' }); }
        res.json(testimonial);
    } catch (err) { res.status(500).send('Gagal update status ulasan.'); }
};