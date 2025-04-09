import Income from "../Model/income-model.js";
import Category from "../Model/category-model.js";

// Create Income
const createIncome = async (req, res, next) => {
  try {
    const userId = req.userID;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    let { amount, source, description, date } = req.body;

    if (!amount || !source || !description) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero." });
    }

    // Find category details
    const sourceDetails = await Category.findById(source);
    if (!sourceDetails) {
      return res.status(404).json({ message: "Category not found." });
    }
    console.log(source);

    const newIncome = new Income({
      userId,
      amount,
      source: source,
      description,
      date: date || new Date(),
    });

    await newIncome.save();

    // Populate source details in response
    const populatedIncome = await Income.findById(newIncome._id).populate(
      "source",
      "name iconImage"
    );

    res.status(201).json({
      message: "Income created successfully!",
      income: populatedIncome,
      sourceName: populatedIncome.source.name,
      sourceImage: populatedIncome.source.iconImage,
    });
  } catch (error) {
    next(error);
  }
};

// Get Income
const getIncome = async (req, res, next) => {
  try {
    const userId = req.userID;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    const income = await Income.find({ userId })
      .sort({ date: -1 })
      .populate("source");

    const totalIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      message: "Income retrieved successfully!",
      income,
      totalIncome: totalIncome[0]?.totalIncome || 0,
    });
  } catch (error) {
    next(error);
  }
};

// Update Income
const updateIncome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingIncome = await Income.findOne({ _id: id, userId });
    if (!existingIncome) {
      return res
        .status(404)
        .json({ message: "Income not found or unauthorized access." });
    }

    // Trim updated fields
    if (req.body.description)
      req.body.description = req.body.description.trim();

    const updatedIncome = await Income.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("source", "name image");

    res.status(200).json({
      message: "Income updated successfully!",
      income: updatedIncome,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Income
const deleteIncome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingIncome = await Income.findOne({ _id: id, userId });
    if (!existingIncome) {
      return res
        .status(404)
        .json({ message: "Income not found or unauthorized access." });
    }

    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

// Get Total Income
const getTotalIncome = async (req, res, next) => {
  try {
    const userId = req.userID;
    const { month, year } = req.query;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    if (!month || !year)
      return res.status(400).json({ message: "Month and year are required." });

    // Convert month and year into a date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalIncome = await Income.aggregate([
      { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    res.status(200).json({ totalIncome: totalIncome[0]?.totalIncome || 0 });
  } catch (error) {
    next(error);
  }
};

// Get Category Wise Income Breakdown
const getIncomeBreakdown = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { month, year } = req.query;

    const matchFilter = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    const incomeData = await Income.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$source",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories", // Name of the collection storing sources
          localField: "_id", // Field from the Income model that references the Source model
          foreignField: "_id", // _id of the Source model
          as: "sourceInfo", // The resulting field that will hold the source info
        },
      },
      {
        $unwind: "$sourceInfo", // Flatten the array to get source details
      },
      {
        $project: {
          _id: 0, // Remove the _id field if it's not needed
          source: "$sourceInfo.name",
          iconImage: "$sourceInfo.iconImage", // Extract source iconImage
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(incomeData);
  } catch (error) {
    next(error);
  }
};

export default {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  getTotalIncome,
  getIncomeBreakdown,
};
