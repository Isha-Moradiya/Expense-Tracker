import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./Utils/db.js";
import errorMiddleware from "./Middleware/error-middleware.js";
import authRoute from "./Router/auth-router.js";
import expenseRoute from "./Router/expense-router.js";
import incomeRoute from "./Router/income-router.js";
import investmentRoute from "./Router/investment-router.js";
import lentRoute from "./Router/lent-router.js";
import borrowRoute from "./Router/borrow-router.js";
import categoryRoute from "./Router/category-router.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "https://expensia.vercel.app",
  methods: "GET,POST,PATCH,PUT,DELETE,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/income", incomeRoute);
app.use("/api/investment", investmentRoute);
app.use("/api/lent", lentRoute);
app.use("/api/borrow", borrowRoute);
app.use("/api/category", categoryRoute);

app.use(errorMiddleware);

let PORT = process.env.PORT || 5006;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
});
