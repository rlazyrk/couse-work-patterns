import express from "express";
import UserController from "../controllers/user.controller.js";
import provider from "../repository/index.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
const userController = new UserController(provider);

router.get("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  userController.getAll(req, res, next);
});

router.get("/:id", authenticate, (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  userController.getById(req, res, next);
});

router.put("/:id", authenticate, (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  userController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  userController.delete(req, res, next);
});

export default router;
