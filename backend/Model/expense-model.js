import { Schema, model } from "mongoose";
import { EXPENSE_TYPES } from "../Constants/expense-constants.js";

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    expenseType: {
      type: String,
      enum: Object.values(EXPENSE_TYPES),
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Expense = model("Expense", expenseSchema);

export default Expense;
