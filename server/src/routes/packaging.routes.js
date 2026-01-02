import express from "express";
import PackagingController from "../controllers/packaging.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const packagingController = new PackagingController(provider);

router.get("/", (req, res, next) => {
  packagingController.getAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  packagingController.getById(req, res, next);
});

router.post("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  packagingController.create(req, res, next);
});

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  packagingController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  packagingController.delete(req, res, next);
});

export default router;
