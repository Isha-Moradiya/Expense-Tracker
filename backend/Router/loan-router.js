import express from "express";
import createLoanEntry from "../Controller/loan-controller.js";
import authMiddleware from "../Middleware/auth-middleware.js";
const router = express.Router();

// Route to create loan entry
router.post("/create-loan", authMiddleware, createLoanEntry);

export default router;
