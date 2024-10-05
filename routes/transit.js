const express = require('express');
const { findTransitRoutes } = require('../controllers/transitController');
const router = express.Router();

router.get('/directions', findTransitRoutes);

module.exports = router;
