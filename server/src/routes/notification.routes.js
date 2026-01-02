import express from "express";
import NotificationController from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const notificationController = new NotificationController(provider);

router.get("/", authenticate, (req, res, next) => {
  notificationController.getAll(req, res, next);
});

router.get("/unread/count", authenticate, (req, res, next) => {
  notificationController.getUnreadCount(req, res, next);
});

router.patch("/:id/read", authenticate, (req, res, next) => {
  notificationController.markAsRead(req, res, next);
});

router.patch("/read-all", authenticate, (req, res, next) => {
  notificationController.markAllAsRead(req, res, next);
});

router.post("/", authenticate, (req, res, next) => {
  notificationController.create(req, res, next);
});

export default router;
