const express = require("express");
const { body } = require("express-validator");
const routeController = require("../controllers/routeController");

const router = express.Router();

router.get("/get", routeController.getRoutes);
router.post(
  "/create",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("user_id").notEmpty().withMessage("user_id is required"),
    body("routes")
      .isArray({ min: 1 })
      .withMessage("At least one route is required"),
    body("routes.*.startX").notEmpty().withMessage("Valid startX is required"),
    body("routes.*.startY").notEmpty().withMessage("Valid startY is required"),
    body("routes.*.endX").notEmpty().withMessage("Valid endX is required"),
    body("routes.*.endY").notEmpty().withMessage("Valid endY is required"),
    body("routes.*.startName").notEmpty().withMessage("Start name is required"),
    body("routes.*.endName").notEmpty().withMessage("End name is required"),
  ],
  routeController.saveRoute
);

module.exports = router;
