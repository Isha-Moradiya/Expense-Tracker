import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import expenseControllers from "../Controller/expense-controller.js";

const router = express.Router();

router
  .route("/create-expense")
  .post(authMiddleware, expenseControllers.createExpense);
router.route("/get-expense").get(authMiddleware, expenseControllers.getExpense);
router
  .route("/update-expense/:id")
  .put(authMiddleware, expenseControllers.updateExpense);
router
  .route("/delete-expense/:id")
  .delete(authMiddleware, expenseControllers.deleteExpense);
router
  .route("/total-expense")
  .get(authMiddleware, expenseControllers.getTotalExpense);
router
  .route("/category-expense")
  .get(authMiddleware, expenseControllers.getExpenseBreakdown);

export default router;
