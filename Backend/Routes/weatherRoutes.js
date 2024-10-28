const express = require('express');
const router = express.Router();
const weatherController = require('../Controllers/weatherController.js');

// Routes
router.get('/rollups', weatherController.getDailyRollups);
router.post('/update-thresholds', weatherController.updateThresholds);  // New route to update thresholds

module.exports = router;
