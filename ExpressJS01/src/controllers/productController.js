const Product = require('../models/product');
const Category = require('../models/category');

// API Seed Data (Tạo dữ liệu mẫu)
const seedData = async (req, res) => {
    try {
        // Xóa dữ liệu cũ
        await Product.deleteMany({});
        await Category.deleteMany({});

        // Tạo Category mẫu
        const categories = await Category.insertMany([
            { name: 'Điện thoại', description: 'Các loại smartphone' },
            { name: 'Laptop', description: 'Máy tính xách tay' },
            { name: 'Phụ kiện', description: 'Tai nghe, ốp lưng, sạc' }
        ]);

        // Tạo Product mẫu
        const products = await Product.insertMany([
            {
                name: 'iPhone 15 Pro Max',
                description: 'Smartphone cao cấp nhất của Apple với thiết kế titan và camera 5x.',
                price: 35000000,
                promotionalPrice: 33000000, // Khuyến mãi
                images: [
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-pure-back-iphone-15-pro-max-natural-titanium-pure-front-2up-screen-usen.png',
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/iphone-15-pro-max-black-titanium-pure-back-iphone-15-pro-max-black-titanium-pure-front-2up-screen-usen.png'
                ],
                stock: 50,
                sold: 120,
                category: categories[0]._id
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Siêu phẩm Android với bút S-Pen và AI thông minh.',
                price: 32000000,
                promotionalPrice: null,
                images: [
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2024/01/18/s24-ultra-grey.png',
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2024/01/18/s24-ultra-black.png'
                ],
                stock: 30,
                sold: 80,
                category: categories[0]._id
            },
            {
                name: 'MacBook Pro 14 inch M3',
                description: 'Laptop siêu mạnh mẽ dành cho dân chuyên nghiệp.',
                price: 40000000,
                promotionalPrice: 38500000, // Khuyến mãi
                images: [
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/10/31/macbook-pro-14-m3-space-gray-1.png'
                ],
                stock: 20,
                sold: 45,
                category: categories[1]._id
            },
            {
                name: 'Tai nghe AirPods Pro 2',
                description: 'Tai nghe chống ồn chủ động xuất sắc.',
                price: 6000000,
                promotionalPrice: 5500000,
                images: [
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2022/09/08/image-removebg-preview-1.png'
                ],
                stock: 100,
                sold: 300,
                category: categories[2]._id
            },
            {
                name: 'Laptop Dell XPS 15',
                description: 'Laptop Windows thiết kế đẹp, hiệu năng cao.',
                price: 45000000,
                promotionalPrice: null,
                images: [
                    'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/06/16/dell-xps-15-9530-1.png'
                ],
                stock: 15,
                sold: 25,
                category: categories[1]._id
            }
        ]);

        return res.status(200).json({
            message: "Seed data successfully!",
            categories,
            products
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi seed data", error: error.message });
    }
};

// Lấy dữ liệu cho Trang Chủ
const getHomepageProducts = async (req, res) => {
    try {
        // Sản phẩm mới nhất (sắp xếp theo createdAt giảm dần, lấy 4)
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(4).populate('category', 'name');
        
        // Sản phẩm bán chạy nhất (sắp xếp theo sold giảm dần, lấy 4)
        const bestSellingProducts = await Product.find().sort({ sold: -1 }).limit(4).populate('category', 'name');

        // Sản phẩm khuyến mãi (promotionalPrice < price)
        const promotionalProducts = await Product.find({
            $and: [
                { promotionalPrice: { $ne: null } },
                { $expr: { $lt: ["$promotionalPrice", "$price"] } }
            ]
        }).limit(4).populate('category', 'name');

        return res.status(200).json({
            latestProducts,
            bestSellingProducts,
            promotionalProducts
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy chi tiết sản phẩm
const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Tìm sản phẩm tương tự (cùng category, khác id hiện tại)
        const similarProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id }
        }).limit(4);

        return res.status(200).json({
            product,
            similarProducts
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Tìm kiếm và Lọc
const searchAndFilterProducts = async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice } = req.query;
        let filter = {};

        // Lọc theo tên sản phẩm
        if (query) {
            filter.name = { $regex: query, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }

        // Lọc theo danh mục
        if (category) {
            filter.category = category;
        }

        // Lọc theo khoảng giá
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).populate('category', 'name');
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả danh mục (Dùng cho dropdown/sidebar filter)
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
         return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}
// Admin: Thêm sản phẩm
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({ message: "Tạo sản phẩm thành công", product });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi tạo sản phẩm", error: error.message });
    }
};

// Admin: Cập nhật sản phẩm (bao gồm cả update số lượng)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        return res.status(200).json({ message: "Cập nhật thành công", product });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

// Admin: Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        return res.status(200).json({ message: "Xóa thành công", product });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xóa", error: error.message });
    }
};

module.exports = {
    seedData,
    getHomepageProducts,
    getProductDetails,
    searchAndFilterProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
};
