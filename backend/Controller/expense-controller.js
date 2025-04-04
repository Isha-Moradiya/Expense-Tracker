import Expense from "../Model/expense-model.js";
import { EXPENSE_TYPES } from "../Constants/expense-constants.js";
import Category from "../Model/category-model.js";

// Create Expense
const createExpense = async (req, res, next) => {
  try {
    const userId = req.userID;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    let { amount, category, description, expenseType, date } = req.body;

    // Validate all required fields
    if (!amount || !category || !description || !expenseType || !date) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero." });
    }

    if (!Object.values(EXPENSE_TYPES).includes(expenseType)) {
      return res.status(400).json({ message: "Invalid expense type." });
    }

    // Find the category by ID (Make sure `category` is the category ID)
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Create the expense
    const newExpense = new Expense({
      userId,
      amount,
      category: category, 
      description,
      expenseType,
      date,
    });
    await newExpense.save();

    // Populate category name and iconImage for the response
    const populatedExpense = await Expense.findById(newExpense._id).populate(
      "category",
      "name iconImage"
    );

    res.status(201).json({
      message: "Expense created successfully!",
      expense: populatedExpense,
      categoryName: populatedExpense.category.name,
      categoryImage: populatedExpense.category.iconImage,
    });
  } catch (error) {
    next(error);
  }
};

// Get Expenses
const getExpense = async (req, res, next) => {
  try {
    const userId = req.userID;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .populate("category");

    const totalExpense = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      message: "Expenses retrieved successfully!",
      expenses,
      totalExpense: totalExpense[0]?.totalExpense || 0,
    });
  } catch (error) {
    next(error);
  }
};

// Update Expense
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingExpense = await Expense.findOne({ _id: id, userId });
    if (!existingExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized access." });
    }

    if (
      req.body.expenseType &&
      !Object.values(EXPENSE_TYPES).includes(req.body.expenseType)
    ) {
      return res.status(400).json({ message: "Invalid expense type." });
    }

    if (req.body.amount && req.body.amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero." });
    }

    // Trim description if provided
    if (req.body.description) {
      req.body.description = req.body.description.trim();
    }

    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Expense updated successfully!",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Expense
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingExpense = await Expense.findOne({ _id: id, userId });
    if (!existingExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized access." });
    }

    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

// Get Total Expense
const getTotalExpense = async (req, res, next) => {
  try {
    const userId = req.userID;
    const { month, year } = req.query;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });
    if (!month || !year)
      return res.status(400).json({ message: "Month and year are required." });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalExpense = await Expense.aggregate([
      { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);

    res.status(200).json({ totalExpense: totalExpense[0]?.totalExpense || 0 });
  } catch (error) {
    next(error);
  }
};

// Get Category Wise Expense Breakdown
const getExpenseBreakdown = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { month, year } = req.query;

    const matchFilter = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    const expenseData = await Expense.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories", // Name of the collection storing categories
          localField: "_id", // Field from the Expense model that references the Category model
          foreignField: "_id", // _id of the Category model
          as: "categoryInfo", // The resulting field that will hold the category info
        },
      },
      {
        $unwind: "$categoryInfo", // Flatten the array to get category details
      },
      {
        $project: {
          _id: 0, // Remove the _id field if it's not needed
          category: "$categoryInfo.name", // Extract category name
          iconImage: "$categoryInfo.iconImage", // Extract category iconImage
          totalAmount: 1, // Keep the totalAmount field
        },
      },
    ]);

    res.status(200).json(expenseData);
  } catch (error) {
    next(error);
  }
};

export default {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getTotalExpense,
  getExpenseBreakdown,
};
