const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// 사용자 프로필 조회 라우트
router.get("/:userId", profileController.getUserProfile);

router.post("/userInfo", profileController.getUserTableData);

module.exports = router;
