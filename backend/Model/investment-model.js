import { Schema, model } from "mongoose";

const investmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    investmentType: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
    },
    currentAmount: {
      type: Number,
      required: true,
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    withdrawnAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Investment = model("Investment", investmentSchema);
export default Investment;
