import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { registerValidator, loginValidator } from "../utils/validators.js";
import { validate } from "../middleware/validation.middleware.js";
import provider from "../repository/index.js";

const router = express.Router();
const authController = new AuthController(provider);

router.post("/register", registerValidator, validate, (req, res, next) => {
  authController.register(req, res, next);
});

router.post("/login", loginValidator, validate, (req, res, next) => {
  authController.login(req, res, next);
});

router.get("/me", authenticate, (req, res, next) => {
  authController.getMe(req, res, next);
});

export default router;
