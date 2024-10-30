// routes/feedRoutes.js
const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feedController");

const router = express.Router();

// 피드에 장소 또는 경로 공유
router.post(
  "/share",
  [
    body("user_id").notEmpty().withMessage("User ID is required"),
    body("place_id")
      .optional()
      .isInt()
      .withMessage("Place ID must be an integer"),
    body("route_id")
      .optional()
      .isInt()
      .withMessage("Route ID must be an integer"),
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("image_url").notEmpty().withMessage("Image URL is required"),
  ],
  feedController.shareToFeed
);

// 모든 피드 조회
router.get("/get-feed", feedController.getFeed);
router.get("/get-feed-detail", feedController.getFeedDetail);
router.get("/get-feed-test", feedController.getFeedTest);

module.exports = router;
