const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/crop', recommendationController.recommendCrop);

module.exports = router;
