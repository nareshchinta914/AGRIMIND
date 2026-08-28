const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// GET /api/market/mandi-prices
router.get('/mandi-prices', marketController.getMandiPrices);

// GET /api/market/merchants
router.get('/merchants', marketController.getMerchants);

// POST /api/market/farmer-sell
router.post('/farmer-sell', marketController.postFarmerProduce);

module.exports = router;
