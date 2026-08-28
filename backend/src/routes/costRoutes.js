const express = require('express');
const router = express.Router();
const costController = require('../controllers/costController');
const { authenticateUser, requireRole } = require('../middleware/auth');

// Calculation doesn't strictly require authentication, but saving does
router.post('/calculate', costController.calculate);

router.use(authenticateUser);

router.post('/', requireRole('FARMER'), costController.saveCost);
router.get('/', costController.getCosts);
router.get('/:id', costController.getCostById);
router.put('/:id', requireRole('FARMER'), costController.updateCost);
router.delete('/:id', requireRole('FARMER'), costController.deleteCost);

module.exports = router;
