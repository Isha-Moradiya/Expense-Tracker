import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import incomeControllers from "../Controller/income-controller.js";

const router = express.Router();

router
  .route("/create-income")
  .post(authMiddleware, incomeControllers.createIncome);
router.route("/get-income").get(authMiddleware, incomeControllers.getIncome);
router
  .route("/update-income/:id")
  .put(authMiddleware, incomeControllers.updateIncome);
router
  .route("/delete-income/:id")
  .delete(authMiddleware, incomeControllers.deleteIncome);
router
  .route("/total-income")
  .get(authMiddleware, incomeControllers.getTotalIncome);
router
  .route("/source-income")
  .get(authMiddleware, incomeControllers.getIncomeBreakdown);

export default router;
