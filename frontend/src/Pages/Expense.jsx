import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSearch, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, X } from "lucide-react";
import Breadcrumb from "../layout/Breadcrumbs";
import SearchBar from "../layout/SearchBar";
import TopActionBar from "../layout/PageHeader";

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
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredExpenses = () => {
    return expenses.filter((expense) => {
      if (filterDate && !expense.date.startsWith(filterDate)) return false;

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        expense.category?.name?.toLowerCase().includes(search) ||
        expense.description?.toLowerCase().includes(search);

      if (searchTerm && !matchesSearch) return false;

      return true;
    });
  };

  const filteredExpenses = getFilteredExpenses();

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

  const isNewExpense = (createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffMs = now - createdTime;
    return diffMs < 2 * 60 * 1000; // within 2 minutes
  };

  return (
    <>
      <motion.div className="flex-1 mx-auto my-12 max-w-full">
        <div className="px-6">
          {/* Header Section */}
          <div className="flex justify-end items-center mb-6 flex-col sm:flex-row">
            <TopActionBar
              label="Expense"
              onAddClick={() => handleOpenModal(null)}
              filterDate={filterDate}
              onDateChange={setFilterDate}
            />
          </div>

          {/* Breadcrums for navigation */}
          <Breadcrumb />

          {/* Total Expense Section */}
          <div className="mb-7">
            <div className="bg-gradient-to-r from-red-100 via-red-200 to-red-300 p-6 rounded-2xl flex flex-col items-center justify-between shadow-md md:flex-row  md:justify-start sm:px-8 sm:py-6 space-y-4 sm:space-y-0 sm:space-x-6 transition-transform duration-300 transform hover:shadow-lg">
              <div className="bg-white p-4 rounded-full text-6xl text-red-600 shadow-lg flex-shrink-0">
                💰
              </div>
              <div className="w-full sm:w-auto text-center sm:text-left md:pt-2 lg:pt-1.5">
                <h3 className="text-sm font-medium text-gray-700 truncate">
                  Total Expense
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 truncate">
                  ₹{totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <SearchBar
            placeholder={"Search Expense..."}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Expense List Section */}
          <motion.div className="mt-6">
            {filteredExpenses.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No expense added yet.
              </p>
            ) : (
              <div className="space-y-6">
                {filteredExpenses.map((exp) => (
                  <motion.div
                    key={exp._id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all relative"
                  >
                    {/* New Badge */}
                    {isNewExpense(exp.createdAt) && (
                      <span className="absolute top-3 right-12 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shadow-sm">
                        New
                      </span>
                    )}

                    {/* Chevron Toggle */}
                    <motion.button
                      className="absolute top-0 right-1 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: expanded === exp._id ? 180 : 0 }}
                      onClick={() =>
                        setExpanded(exp._id === expanded ? null : exp._id)
                      }
                    >
                      <ChevronDown size={22} />
                    </motion.button>

                    {/* Main Row */}
                    <div className="flex justify-between items-start sm:items-center flex-wrap gap-4">
                      {/* Left Block */}
                      <div className="flex items-start gap-4 flex-1 min-w-[220px]">
                        {/* Icon */}
                        <div className="w-10 h-10 flex-shrink-0">
                          {exp?.category?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${exp.category.iconImage}`}
                              alt={exp.category.name || "Category"}
                              className="w-full h-full object-contain rounded transition-transform duration-200 hover:scale-105"
                            />
                          ) : (
                            <div className="text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Description & Category */}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {exp.description || "No description"}
                          </p>
                          <span className="text-xs text-gray-500 mt-1">
                            {exp?.category?.name || "No Category"}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col items-end text-right px-6 py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Amount:
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                          ₹{exp.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === exp._id
                          ? { opacity: 1, height: "auto", marginTop: 16 }
                          : { opacity: 0, height: 0, marginTop: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 bg-gradient-to-br from-gray-50 to-white border-t pt-5 px-4 pb-4 rounded-xl shadow-inner text-sm text-gray-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">📅</span>
                          <span>
                            <span className="font-medium text-gray-600">
                              Date:
                            </span>{" "}
                            {new Date(exp.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">💼</span>
                          <span>
                            <span className="font-medium text-gray-600">
                              Type:
                            </span>{" "}
                            {exp.expenseType.toUpperCase()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex flex-wrap justify-end gap-3">
                          <button
                            onClick={() => handleOpenModal(exp)}
                            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all shadow-sm"
                          >
                            <Edit2
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(exp._id)}
                            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:text-red-800 transition-all shadow-sm"
                          >
                            <Trash
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
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
