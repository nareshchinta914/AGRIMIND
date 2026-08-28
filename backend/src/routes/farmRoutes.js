const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { authenticateUser, requireRole } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', farmController.getFarms);
router.post('/', requireRole('FARMER'), farmController.createFarm);
router.get('/:id', farmController.getFarmById);
router.put('/:id', requireRole('FARMER'), farmController.updateFarm);
router.delete('/:id', requireRole('FARMER'), farmController.deleteFarm);

module.exports = router;
