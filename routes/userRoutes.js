const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

const router = express.Router();

// 자체 회원가입 라우트
router.post(
  "/register/native",
  [
      body("userId").notEmpty().withMessage("아이디를 입력해주세요."),
      body("password").isLength({ min: 6 }).withMessage("비밀번호는 최소 6자리 이상이어야 합니다.")
  ],
  userController.registerNative
);

// 소셜 회원가입 라우트
router.post(
  "/register/social",
  [
      body("idToken").notEmpty().withMessage("소셜 토큰을 입력해주세요."),
      body("provider").isIn(['google', 'kakao', 'naver']).withMessage("유효하지 않은 소셜 제공자입니다.")
  ],
  userController.registerWithSocial
);

// 소셜 로그인 엔드포인트
router.post("/auth/google", (req, res, next) => {
  req.body.provider = 'google';
  next();
}, userController.registerWithSocial);

router.post("/auth/kakao", (req, res, next) => {
  req.body.provider = 'kakao';
  next();
}, userController.registerWithSocial);

router.post("/auth/naver", (req, res, next) => {
  req.body.provider = 'naver';
  next();
}, userController.registerWithSocial);

module.exports = router;
