import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import categoryController from "../Controller/category-controller.js";
import upload from "../Middleware/upload-middleware.js";

const router = express.Router();

router
  .route("/add-category")
  .post(
    authMiddleware,
    upload.single("iconImage"),
    categoryController.addCategory
  );
router
  .route("/get-category")
  .get(authMiddleware, categoryController.getCategory);

router
  .route("/update-category/:id")
  .put(
    authMiddleware,
    upload.single("iconImage"),
    categoryController.updateCategory
  );
router
  .route("/delete-category/:id")
  .delete(authMiddleware, categoryController.deleteCategory);

export default router;
