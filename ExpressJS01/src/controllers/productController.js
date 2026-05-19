const Product = require('../models/product');
const Category = require('../models/category');



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
        // Tăng views mỗi lần xem chi tiết
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('category', 'name');
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

// Lấy sản phẩm theo danh mục có phân trang server-side
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip  = (page - 1) * limit;

        // Kiểm tra danh mục tồn tại
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        const [products, totalProducts] = await Promise.all([
            Product.find({ category: categoryId })
                .populate('category', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments({ category: categoryId })
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: page,
            limit,
            category: { _id: category._id, name: category.name }
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy top 10 sản phẩm bán chạy nhất
const getTopBestSelling = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await Product.find()
            .sort({ sold: -1 })
            .limit(limit)
            .populate('category', 'name');
        return res.status(200).json({ products, total: products.length });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy top 10 sản phẩm xem nhiều nhất
const getTopMostViewed = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await Product.find()
            .sort({ views: -1 })
            .limit(limit)
            .populate('category', 'name');
        return res.status(200).json({ products, total: products.length });
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
    getHomepageProducts,
    getProductDetails,
    searchAndFilterProducts,
    getCategories,
    getProductsByCategory,
    getTopBestSelling,
    getTopMostViewed,
    createProduct,
    updateProduct,
    deleteProduct
};
