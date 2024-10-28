// routes/feedRoutes.js
const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

// Get all shared routes for the feed
router.get('/', feedController.getFeed);

// Share a route to the feed
router.post('/share', feedController.shareRoute);

module.exports = router;
