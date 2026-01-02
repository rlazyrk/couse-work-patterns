import express from "express";
import BouquetController from "../controllers/bouquet.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { bouquetValidator } from "../utils/validators.js";
import { validate } from "../middleware/validation.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const bouquetController = new BouquetController(provider);

router.get("/", (req, res, next) => {
  bouquetController.getAll(req, res, next);
});

router.get("/:id", (req, res, next) => {
  bouquetController.getById(req, res, next);
});

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  bouquetValidator,
  validate,
  (req, res, next) => {
    bouquetController.create(req, res, next);
  }
);

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  bouquetController.update(req, res, next);
});

router.delete("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  bouquetController.delete(req, res, next);
});

export default router;
