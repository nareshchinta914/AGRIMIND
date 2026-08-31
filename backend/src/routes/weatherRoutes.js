const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/current', weatherController.getCurrent);
router.get('/forecast', weatherController.getForecast);
router.get('/search', weatherController.searchLocation);

module.exports = router;
