import Category from "../Model/category-model.js";
import Investment from "../Model/investment-model.js";

// Create Investment
const createInvestment = async (req, res, next) => {
  try {
    const userId = req.userID;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    const {
      name,
      investmentType,
      platform,
      currentAmount,
      investedAmount,
      description,
    } = req.body;

    // Validate required fields dynamically
    if (
      !name ||
      !investmentType ||
      !platform ||
      !currentAmount ||
      !investedAmount
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Find category details
    const investmentTypeDetails = await Category.findById(investmentType);
    if (!investmentTypeDetails) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Create and save a new investment document
    const newInvestment = new Investment({
      userId,
      name,
      investmentType: investmentTypeId,
      platform,
      currentAmount,
      investedAmount,
      description,
    });

    await newInvestment.save();

    // Populate investment type with name and image
    const populatedInvestment = await Investment.findById(
      newInvestment._id
    ).populate("investmentType", "name iconImage");

    res.status(201).json({
      message: "Investment created successfully.",
      investment: populatedInvestment,
      investmentTypeName: populatedInvestment.investmentType.name,
      investmentTypeImage: populatedInvestment.investmentType.iconImage,
    });
  } catch (error) {
    next(error);
  }
};

// Get Investments with Summary Data
const getInvestment = async (req, res, next) => {
  try {
    const userId = req.userID;

    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    const investments = await Investment.find({ userId }).populate(
      "investmentType"
    );

    if (!investments.length) {
      return res.status(404).json({ message: "No investments found." });
    }

    // Calculate total and remaining investments
    const summary = investments.reduce(
      (acc, inv) => {
        acc.totalInvestments += inv.investedAmount;
        acc.currentAmountTotal += inv.currentAmount;
        return acc;
      },
      { totalInvestments: 0, currentAmountTotal: 0 }
    );

    const withdrawInvestments =
      summary.totalInvestments - summary.currentAmountTotal;

    res.status(200).json({
      message: "Investments retrieved successfully.",
      investments,
      totalInvestments: summary.totalInvestments,
      withdrawInvestments,
      remainingInvestments: summary.currentAmountTotal,
    });
  } catch (error) {
    next(error);
  }
};

// Update Investment
const updateInvestment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingInvestment = await Investment.findOne({ _id: id, userId });
    if (!existingInvestment) {
      return res
        .status(404)
        .json({ message: "Investment not found or unauthorized access." });
    }

    if (req.body.investmentTypeId) {
      const investmentType = await Category.findById(req.body.investmentTypeId);
      if (!investmentType) {
        return res.status(404).json({ message: "Category not found." });
      }
    }

    // Update only the fields that are provided
    const updatedInvestment = await Investment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Investment updated successfully.",
      investment: updatedInvestment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Investment
const deleteInvestment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userID;

    const existingInvestment = await Investment.findOne({ _id: id, userId });
    if (!existingInvestment) {
      return res
        .status(404)
        .json({ message: "Investment not found or unauthorized access." });
    }

    await Investment.findByIdAndDelete(id);

    res.status(200).json({ message: "Investment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export default {
  createInvestment,
  getInvestment,
  updateInvestment,
  deleteInvestment,
};
