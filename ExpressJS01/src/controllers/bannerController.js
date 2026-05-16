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

// Seed dữ liệu mẫu (Chạy 1 lần)
const seedBanners = async (req, res) => {
    try {
        await Banner.deleteMany({}); // Xóa cũ

        const banners = await Banner.insertMany([
            {
                title: "iPhone 15 Pro",
                description: "Titan. Thật bền. Thật nhẹ. Thật Pro.",
                imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2000&auto=format&fit=crop",
                linkTo: "/search?category=iphone",
                type: "hero",
                isActive: true
            },
            {
                title: "MacBook Air M3",
                description: "Siêu mỏng. Siêu mạnh. Siêu M3.",
                imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
                linkTo: "/search?category=mac",
                type: "sub",
                isActive: true
            },
            {
                title: "Apple Watch Ultra 2",
                description: "Cuộc phiêu lưu cấp độ mới.",
                imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop",
                linkTo: "/search?category=watch",
                type: "sub",
                isActive: true
            }
        ]);

        return res.status(200).json({ message: "Seed banners thành công", banners });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi seed data", error: error.message });
    }
};

module.exports = {
    getAllBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    seedBanners
};
