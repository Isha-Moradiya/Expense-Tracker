import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    iconImage: {
      type: String,
      default: "/uploads/default-profile.png",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryType: {
      type: String,
      enum: ["Expense", "Income", "Investment"],
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

export default Category;
