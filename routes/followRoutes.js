const express = require("express");
const followController = require("../controllers/followController");

const router = express.Router();

router.get("/follower/:userId", followController.getFollowers);
router.get("/following/:userId", followController.getFollowing);

router.post("/add-follow", followController.addFollow);
router.delete("/delete-follow", followController.deleteFollow); 

module.exports = router;
