const Banner = require('../models/banner');

// Lấy danh sách tất cả banner (Cho Admin)
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        return res.status(200).json(banners);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách banner đang hoạt động (Cho Frontend hiển thị)
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        
        // Phân loại banner
        const heroBanners = banners.filter(b => b.type === 'hero');
        const subBanners = banners.filter(b => b.type === 'sub');

        return res.status(200).json({ heroBanners, subBanners });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Thêm mới banner
const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        return res.status(201).json({ message: "Tạo banner thành công", banner });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi tạo banner", error: error.message });
    }
};

// Cập nhật banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
        if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });
        return res.status(200).json({ message: "Cập nhật thành công", banner });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

// Xóa banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });
        return res.status(200).json({ message: "Xóa thành công", banner });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
};



module.exports = {
    getAllBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner
};
