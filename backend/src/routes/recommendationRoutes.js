const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/crop', recommendationController.recommendCrop);
router.post('/analyze-soil-image', recommendationController.analyzeSoilImage);

module.exports = router;
