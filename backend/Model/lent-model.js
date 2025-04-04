import { Schema, model } from "mongoose";

const lentMoneySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lender: { type: String, required: true },
    borrower: { type: String, required: true },
    borrowerEmail: { type: String, required: true },
    borrowerImage: { type: String, default: "default-profile.png" },
    initialAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    repaidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Unpaid", "Cleared"], default: "Unpaid" },
    description: { type: String, default: "" },

    // New fields
    isEmailSent: { type: Boolean, default: false },
    clearedEmailSent: { type: Boolean, default: false },
    emailSentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const LentMoney = model("LentMoney", lentMoneySchema);
export default LentMoney;
