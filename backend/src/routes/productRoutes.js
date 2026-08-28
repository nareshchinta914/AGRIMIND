const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, requireRole } = require('../middleware/auth');

// Public catalog search
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Seller/Merchant management routes
router.post('/', authenticateUser, requireRole('FARMER', 'MERCHANT'), productController.createProduct);
router.put('/:id', authenticateUser, requireRole('FARMER', 'MERCHANT'), productController.updateProduct);
router.delete('/:id', authenticateUser, requireRole('FARMER', 'MERCHANT'), productController.deleteProduct);

// Customer wishlist toggle
router.post('/:id/wishlist', authenticateUser, productController.toggleWishlist);

module.exports = router;
