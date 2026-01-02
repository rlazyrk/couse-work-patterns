import express from "express";
import EventTypeController from "../controllers/eventType.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const eventTypeController = new EventTypeController(provider);

router.get("/", (req, res, next) => {
  eventTypeController.getAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  eventTypeController.getById(req, res, next);
});

router.post("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  eventTypeController.create(req, res, next);
});

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  eventTypeController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  eventTypeController.delete(req, res, next);
});

export default router;
