import { Schema, model } from "mongoose";

const borrowedMoneySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrower: {
      type: String,
      required: true,
    },
    lender: {
      type: String,
      required: true,
    },
    lenderImage: {
      type: String,
      default: "default-profile.png",
    },
    lenderEmail: {
      type: String,
      required: true,
    },
    initialAmount: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    repaidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Cleared", "Unpaid"],
      default: "Unpaid",
    },
    description: {
      type: String,
      required: false,
    },

    // New fields
    isEmailSent: { type: Boolean, default: false },
    clearedEmailSent: { type: Boolean, default: false },
    emailSentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const BorrowedMoney = model("BorrowedMoney", borrowedMoneySchema);
export default BorrowedMoney;
