import express from "express";
import ClientCardController from "../controllers/clientCard.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const clientCardController = new ClientCardController(provider);

router.get("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  clientCardController.getAll(req, res, next);
});

router.get("/user/:userId", authenticate, (req, res, next) => {
  clientCardController.getByUserId(req, res, next);
});

router.get("/:id", authenticate, (req, res, next) => {
  clientCardController.getById(req, res, next);
});

router.post("/", authenticate, authorize("ADMIN"), (req, res, next) => {
  clientCardController.create(req, res, next);
});

router.put("/:id", authenticate, authorize("ADMIN"), (req, res, next) => {
  clientCardController.update(req, res, next);
});

router.patch(
  "/:id/bonus",
  authenticate,
  authorize("ADMIN"),
  (req, res, next) => {
    clientCardController.addBonusPoints(req, res, next);
  }
);

export default router;
