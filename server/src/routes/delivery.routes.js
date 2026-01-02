import express from "express";
import DeliveryController from "../controllers/delivery.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const deliveryController = new DeliveryController(provider);

router.get("/", (req, res, next) => {
  deliveryController.getAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  deliveryController.getById(req, res, next);
});

router.post("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  deliveryController.create(req, res, next);
});

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  deliveryController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  deliveryController.delete(req, res, next);
});

export default router;
