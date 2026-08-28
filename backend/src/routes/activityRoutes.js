const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateUser, requireRole } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', activityController.getActivities);
router.post('/', requireRole('FARMER'), activityController.createActivity);
router.put('/:id', requireRole('FARMER'), activityController.updateActivity);
router.delete('/:id', requireRole('FARMER'), activityController.deleteActivity);

module.exports = router;
