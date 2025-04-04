import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import borrowControllers from "../Controller/borrow-controller.js";
import upload from "../Middleware/upload-middleware.js";
const router = express.Router();

router
  .route("/create-borrow")
  .post(
    authMiddleware,
    upload.single("lenderImage"),
    borrowControllers.createBorrow
  );
router.route("/get-borrow").get(authMiddleware, borrowControllers.getBorrow);
router
  .route("/update-borrow/:id")
  .put(
    authMiddleware,
    upload.single("lenderImage"),
    borrowControllers.updateBorrow
  );
router
  .route("/delete-borrow/:id")
  .delete(authMiddleware, borrowControllers.deleteBorrow);

export default router;
