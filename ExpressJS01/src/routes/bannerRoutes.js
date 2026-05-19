const express = require('express');
const { 
    getAllBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Routes Public
router.get('/active', getActiveBanners);

// Routes Protected (Admin)
router.get('/', auth, isAdmin, getAllBanners);
router.post('/', auth, isAdmin, createBanner);
router.put('/:id', auth, isAdmin, updateBanner);
router.delete('/:id', auth, isAdmin, deleteBanner);

module.exports = router;
