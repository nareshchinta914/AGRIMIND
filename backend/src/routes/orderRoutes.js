const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, requireRole } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', requireRole('CUSTOMER', 'MERCHANT', 'FARMER'), orderController.createOrder);
router.put('/:id/status', requireRole('MERCHANT', 'FARMER'), orderController.updateOrderStatus);

module.exports = router;
