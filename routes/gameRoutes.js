const express = require('express');
const router = express.Router();

const gamedbController = require('../controllers/gamedbController');

router.get('/', gamedbController.dbinfo);

module.exports = router;