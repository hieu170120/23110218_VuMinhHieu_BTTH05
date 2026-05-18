const express = require('express');
const { 
    seedData, 
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
} = require('../controllers/productController');

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Routes Public (Không cần auth để xem)
router.get('/seed', seedData);               // Chạy 1 lần để tạo dữ liệu mẫu
router.get('/home', getHomepageProducts);
router.get('/search', searchAndFilterProducts);
router.get('/categories', getCategories);
router.get('/top-selling', getTopBestSelling);  // Top 10 bán chạy nhất
router.get('/top-viewed', getTopMostViewed);    // Top 10 xem nhiều nhất
router.get('/category/:categoryId', getProductsByCategory); // Sản phẩm theo danh mục (phân trang)
router.get('/:id', getProductDetails);

// Routes Protected (Cần quyền Admin)
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
