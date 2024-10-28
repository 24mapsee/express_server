const express = require("express");
const router = express.Router();

const mapController = require("../controllers/mapController");

router.get("/", mapController.getMapData);
router.get("/test-route", mapController.getTestRouteData);
module.exports = router;
