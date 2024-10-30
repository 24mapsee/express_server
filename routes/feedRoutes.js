// routes/feedRoutes.js
const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const feedController = require("../controllers/feedController");

const router = express.Router();
const upload = multer(); // multer 설정 (메모리 스토리지 사용)

router.post(
  "/share",
  upload.single("image"), // 이미지 파일을 'image' 필드에서 받아옴
  [
    body("user_id").notEmpty().withMessage("User ID is required"),
    body("place_id").optional().isInt().withMessage("Place ID must be an integer"),
    body("route_id").optional().isInt().withMessage("Route ID must be an integer"),
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  feedController.shareToFeed
);

// 모든 피드 조회
router.get("/get-feed", feedController.getFeed);
router.get("/get-feed-detail", feedController.getFeedDetail);
router.get("/get-feed-test", feedController.getFeedTest);

module.exports = router;
