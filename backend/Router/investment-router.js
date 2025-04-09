import express from "express";
import authMiddleware from "../Middleware/auth-middleware.js";
import investmentControllers from "../Controller/investment-controller.js";

const router = express.Router();

router
  .route("/create-investment")
  .post(authMiddleware, investmentControllers.createInvestment);
router
  .route("/get-investment")
  .get(authMiddleware, investmentControllers.getInvestment);

router
  .route("/update-investment/:id")
  .put(authMiddleware, investmentControllers.updateInvestment);

router
  .route("/delete-investment/:id")
  .delete(authMiddleware, investmentControllers.deleteInvestment);
router
  .route("/investment-chart")
  .get(authMiddleware, investmentControllers.getInvestmentChart);

export default router;
