import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import lentControllers from "../Controller/lent-controller.js";
import upload from "../Middleware/upload-middleware.js";
const router = express.Router();

router
  .route("/create-lent")
  .post(
    authMiddleware,
    upload.single("borrowerImage"),
    lentControllers.createLent
  );
router.route("/get-lent").get(authMiddleware, lentControllers.getLent);
router
  .route("/update-lent/:id")
  .put(
    authMiddleware,
    upload.single("borrowerImage"),
    lentControllers.updateLent
  );
router
  .route("/delete-lent/:id")
  .delete(authMiddleware, lentControllers.deleteLent);

export default router;
