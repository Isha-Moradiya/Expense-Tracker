import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSearch, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, X } from "lucide-react";

const Expense = () => {
  const { authorizationToken } = useAuth();
  const location = useLocation();

  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [selectedType, setSelectedType] = useState("personal");
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: {},
    description: "",
    expenseType: "personal",
    date: new Date().toISOString().split("T")[0],
  });
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/expense/get-expense`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      setExpenses(data.expenses);
      setTotalExpense(data.totalExpense);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Category
  const fetchExpenseCategories = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/category/get-category?type=Expense`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      setExpenseCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchExpenseCategories();
  }, []);

  //Handle Delete
  const handleDeleteClick = (id) => {
    setDeleteModal(id);
  };

  const confirmDelete = () => {
    handleDelete(deleteModal);
    setDeleteModal(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/expense/delete-expense/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  //Handle Open Modal
  const handleOpenModal = (expense) => {
    if (expense) {
      setExpenseData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        expenseType: expense.expenseType,
        date: expense.date.split("T")[0],
      });
      setCurrentExpense(expense);
    } else {
      setExpenseData({
        amount: "",
        category: null,
        description: "",
        expenseType: "personal",
        date: new Date().toISOString().split("T")[0],
      });
      setCurrentExpense(null);
    }
    setShowModal(true);
  };

  // Handle Form Submit (add or update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedExpenseData = {
      ...expenseData,
      category: expenseData.category._id,
    };

    try {
      if (currentExpense) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/expense/update-expense/${
            currentExpense._id
          }`,
          formattedExpenseData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Expense updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/expense/create-expense`,
          formattedExpenseData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Expense added successfully");
      }
      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense");
    }
  };

  //Handle Category Change
  const handleCategoryChange = (e) => {
    const selectedCategory = expenseCategories.find(
      (category) => category.name === e.target.value
    );
    setExpenseData({
      ...expenseData,
      category: selectedCategory,
    });
  };

  return (
    <>
      <motion.div className="flex-1 mx-auto my-12 p-6">
        <div className="p-8">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              Expenses
            </h2>
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform flex items-center justify-center"
              aria-label="Add Expense"
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* Breadcrums for navigate */}
          <nav className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
            <Link
              to="/home"
              className={`${
                location.pathname === "/home"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-900"
              }`}
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/expense"
              className={`${
                location.pathname === "/expense"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-900"
              }`}
            >
              Expense
            </Link>
          </nav>

          {/* Total Expense Section */}
          <div className="mb-6">
            <div className="bg-red-100 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-red-200 p-3.5 rounded-full text-4xl  ">📉</div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Expense</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 shadow-sm w-full focus-within:border-red-400">
              <FaSearch className="text-gray-300 text-lg mr-2 focus-within:text-red-400" />
              <input
                type="text"
                placeholder="Search expense..."
                className="w-full bg-transparent outline-none text-sm text-gray-500"
                onFocus={(e) =>
                  e.target.previousSibling.classList.add("text-red-400")
                }
                onBlur={(e) =>
                  e.target.previousSibling.classList.remove("text-red-400")
                }
              />
            </div>

            {/* <div className="ml-4 p-3 rounded-full bg-cyan-100 shadow-lg hover:bg-cyan-200 transition-colors">
              <FaCalendarAlt className="text-cyan-600 text-xl" />
            </div> */}
          </div>

          {/* Expense List Section */}
          <motion.div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Expense List
            </h3>
            {expenses.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No expenses added yet.
              </p>
            ) : (
              <div className="space-y-6 bg-gradient-to-b from-red-50 to-gray-50 p-6 rounded-lg shadow">
                {expenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all w-full"
                  >
                    {/* Main Expense Row */}
                    <div className="flex items-center justify-between cursor-pointer">
                      {/* Left Side - Category Image & Details */}
                      <div className="flex items-center space-x-5">
                        {/* Category Icon */}
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-red-400 shadow">
                          {exp?.category?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${exp.category.iconImage}`}
                              alt={exp.category.name || "Category"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Expense Details */}
                        <div className="flex flex-col">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {exp?.category?.name || "No Category"}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            Date: {new Date(exp.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Expense Type: {exp.expenseType.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Amount & Actions */}
                      <div className="flex items-center">
                        <p className="text-xl font-bold text-red-800 mr-4">
                          Total Amount : ₹{exp.amount.toLocaleString()}
                        </p>
                        <motion.button
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: expanded === exp._id ? 180 : 0 }}
                        >
                          <ChevronDown
                            size={18}
                            onClick={() =>
                              setExpanded(exp._id === expanded ? null : exp._id)
                            }
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Dropdown Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === exp._id
                          ? { opacity: 1, height: "auto" }
                          : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">
                          Description : {exp.description}
                        </p>

                        {/* Buttons: Edit & Delete */}
                        <div className="flex justify-end space-x-3 mt-3">
                          <button
                            onClick={() => handleOpenModal(exp)}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                          >
                            <Edit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(exp._id)}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative p-10 bg-gradient-to-tr from-red-50 via-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Cancel Icon at the Top Right */}
            <button
              type="button"
              onClick={() => setDeleteModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-7 h-7" />
            </button>

            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-6">
              {/* Confirm Delete Button */}
              <button
                onClick={confirmDelete}
                className="px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="relative p-10 bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Cancel Icon at the Top Right */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-7 h-7" />
            </button>
            <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
              {currentExpense ? "Edit Expense" : "Add New Expense"}
            </h2>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Category
              </label>
              <select
                value={expenseData.category ? expenseData.category.name : ""}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 form-select"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {expenseCategories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    amount: e.target.value,
                  })
                }
                required
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter your description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
                rows="3"
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            {/* Expense Type Toggle */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Expense Type
              </label>
              <div className="mt-2 flex w-full border border-gray-300 rounded-lg overflow-hidden">
                <div
                  onClick={() => setSelectedType("personal")}
                  className={`w-1/2 text-center py-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
                    selectedType === "personal"
                      ? "bg-red-100 text-red-500 border border-red-500 rounded-l-lg"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  Personal
                </div>
                <div
                  onClick={() => setSelectedType("family")}
                  className={`w-1/2 text-center py-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
                    selectedType === "family"
                      ? "bg-red-100 text-red-500 border border-red-500 rounded-r-lg"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  Family
                </div>
              </div>
            </div>
            {/* Date */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                value={expenseData.date}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    date: e.target.value,
                  })
                }
              />
            </div>
            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
              >
                {currentExpense ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Expense;
