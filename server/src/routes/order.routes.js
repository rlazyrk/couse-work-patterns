import express from "express";
import OrderController from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { orderValidator } from "../utils/validators.js";
import { validate } from "../middleware/validation.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const orderController = new OrderController(provider);

router.get("/", authenticate, (req, res, next) => {
  orderController.getAll(req, res, next);
});

router.get("/:id", authenticate, (req, res, next) => {
  orderController.getById(req, res, next);
});

router.post("/", authenticate, orderValidator, validate, (req, res, next) => {
  orderController.create(req, res, next);
});

router.patch("/:id/status", authenticate, (req, res, next) => {
  orderController.updateStatus(req, res, next);
});

router.post("/:id/cancel", authenticate, (req, res, next) => {
  orderController.cancel(req, res, next);
});

export default router;
