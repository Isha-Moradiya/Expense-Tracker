import Category from "../Model/category-model.js";

const getCategory = async (req, res, next) => {
  try {
    const { type } = req.query; // Category type (Expense, Income, Investment)
    const { _id: userId } = req.user; // User ID from authenticated request

    if (!type || !["Expense", "Income", "Investment"].includes(type)) {
      return res.status(400).json({ message: "Invalid category type!" });
    }

    // Fetch user-defined categories from the database
    const userCategories = await Category.find({ categoryType: type, userId });

    res.status(200).json(userCategories); // Return dynamic user categories
  } catch (error) {
    next(error);
  }
};

// Add a new user-defined category
const addCategory = async (req, res, next) => {
  const { name, categoryType } = req.body;
  const { _id: userId } = req.user;
  const iconImage = req.file ? req.file.filename : null;

  if (!name || !categoryType) {
    return res
      .status(400)
      .json({ message: "Category name and type are required!" });
  }

  try {
    // Check if category already exists for the user
    const existingCategory = await Category.findOne({
      name,
      categoryType,
      userId,
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }

    // Create and save a new category
    const newCategory = new Category({ name, categoryType, iconImage, userId });
    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category added successfully!", category: newCategory });
  } catch (error) {
    next(error);
  }
};

// Update an existing category
const updateCategory = async (req, res, next) => {
  const { id } = req.params; // ID of the category to update
  const { name, categoryType } = req.body;
  const { _id: userId } = req.user; // Logged-in user's ID
  const iconImage = req.file ? req.file.filename : null; // Handle image update

  if (!name || !categoryType) {
    return res
      .status(400)
      .json({ message: "Category name and type are required!" });
  }

  try {
    // Build the update object dynamically
    const updateFields = { name, categoryType };
    if (iconImage) updateFields.iconImage = iconImage; // Add image only if it's uploaded

    // Update the category for the logged-in user
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId }, // Find category by ID and userId (to prevent unauthorized updates)
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    res.status(200).json({
      message: "Category updated successfully!",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user-defined category
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const deletedCategory = await Category.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export default { getCategory, addCategory, updateCategory, deleteCategory };
