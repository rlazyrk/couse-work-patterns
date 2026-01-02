import express from "express";
import FlowerController from "../controllers/flower.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const flowerController = new FlowerController(provider);

router.get("/", (req, res, next) => {
  flowerController.getAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  flowerController.getById(req, res, next);
});

router.post("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  flowerController.create(req, res, next);
});

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  flowerController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  flowerController.delete(req, res, next);
});

export default router;
