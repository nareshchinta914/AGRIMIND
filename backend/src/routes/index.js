const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const farmRoutes = require('./farmRoutes');
const cropRoutes = require('./cropRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const weatherRoutes = require('./weatherRoutes');
const waterRoutes = require('./waterRoutes');
const costRoutes = require('./costRoutes');
const activityRoutes = require('./activityRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const assistantRoutes = require('./assistantRoutes');
const marketRoutes = require('./marketRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/weather', weatherRoutes);
router.use('/water', waterRoutes);
router.use('/costs', costRoutes);
router.use('/activities', activityRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/assistant', assistantRoutes);
router.use('/ai', assistantRoutes);
router.use('/market', marketRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    system: 'AGRIMIND Core API Engine',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
