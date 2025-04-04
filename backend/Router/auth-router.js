import express from "express";
const router = express.Router();

import authControllers from "../Controller/auth-controller.js";
import authMiddleware from "../Middleware/auth-middleware.js";
import validate from "../Middleware/validate-middleware.js";
import authSchema from "../Validators/auth-validator.js";
import upload from "../Middleware/upload-middleware.js";

router
  .route("/register")
  .post(validate(authSchema.registerSchema), authControllers.register);

router
  .route("/login")
  .post(validate(authSchema.loginSchema), authControllers.login);

router.route("/verify-email").get(authControllers.verifyEmail);

router.route("/resend-email").post(authControllers.resendEmail);

router.route("/user").get(authMiddleware, authControllers.user);
router
  .route("/user/:id")
  .put(authMiddleware, upload.single("photo"), authControllers.userUpdate);

export default router;
