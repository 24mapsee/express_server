const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("", (req, res) => {
  res.send("hi");
});

//local~~/user/create-user 로 테스트해보기
router.get("/create-user", userController.createRandomUser);

router.get("/save-place", userController.SavePlaceTest);

router.get("/get-place", userController.GetPlaceTest);

// 회원가입 라우트
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.register
);

router.post(
  "/save-place",
  [
    body("uid").notEmpty().withMessage("Username is required"),
    body("name").notEmpty().withMessage("Valid email is required"),
    body("latitude").notEmpty().withMessage("Valid email is required"),
    body("longitude").notEmpty().withMessage("Valid email is required"),
  ],
  userController.SavePlace
);

router.post(
  "/get-place",
  [body("uid").notEmpty().withMessage("Username is required")],
  userController.SavePlace
);

module.exports = router;
