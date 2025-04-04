import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSearch, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, TrendingUp, X } from "lucide-react";

const Income = () => {
  const { authorizationToken } = useAuth();
  const location = useLocation();

  const [incomes, setIncomes] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [incomeData, setIncomeData] = useState({
    source: {},
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/income/get-income`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      setIncomes(data.income);
      setTotalIncome(data.totalIncome);
    } catch (error) {
      toast.error("Failed to fetch incomes");
    }
  };

  // Fetch Category
  const fetchIncomeCategories = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/category/get-category?type=Income`,
        {
          headers: { Authorization: authorizationToken },
        }
      );

      setIncomeCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchIncomeCategories();
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
        `${import.meta.env.VITE_BACKEND_URL}/api/income/delete-income/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      toast.success("Income deleted successfully");
      fetchIncomes(); // Refresh income list after deletion
    } catch (error) {
      toast.error("Failed to delete income");
    }
  };

  //Handle Open Modal
  const handleOpenModal = (income) => {
    if (income) {
      setIncomeData({
        source: income.source,
        amount: income.amount,
        description: income.description,
        date: income.date.split("T")[0],
      });
      setCurrentIncome(income);
    } else {
      setIncomeData({
        source: null,
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setCurrentIncome(null);
    }
    setShowModal(true);
  };

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedIncomeData = {
      ...incomeData,
      source: incomeData.source._id,
    };

    try {
      if (currentIncome) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/income/update-income/${
            currentIncome._id
          }`,
          formattedIncomeData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Income updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/income/create-income`,
          formattedIncomeData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Income added successfully");
      }

      setShowModal(false);
      fetchIncomes();
    } catch (error) {
      toast.error("Failed to save income");
    }
  };

  //Handle Category Change
  const handleSourceChange = (e) => {
    const selectedSource = incomeCategories.find(
      (source) => source.name === e.target.value
    );
    setIncomeData({
      ...incomeData,
      source: selectedSource,
    });
  };

  return (
    <>
      <motion.div className="flex-1 mx-auto my-12 p-6">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              Incomes
            </h2>
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform flex items-center justify-center"
              aria-label="Add Income"
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
              to="/income"
              className={`${
                location.pathname === "/income"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-900"
              }`}
            >
              Income
            </Link>
          </nav>

          {/* Total Income Section */}
          <div className="mb-6">
            <div className="bg-green-100 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Income</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 shadow-sm w-full focus-within:border-green-400">
              <FaSearch className="text-gray-300 text-lg mr-2 focus-within:text-green-400" />
              <input
                type="text"
                placeholder="Search expense..."
                className="w-full bg-transparent outline-none text-sm text-gray-500"
                onFocus={(e) =>
                  e.target.previousSibling.classList.add("text-green-400")
                }
                onBlur={(e) =>
                  e.target.previousSibling.classList.remove("text-green-400")
                }
              />
            </div>

            {/* <div className="ml-4 p-3 rounded-full bg-cyan-100 shadow-lg hover:bg-cyan-200 transition-colors">
              <FaCalendarAlt className="text-cyan-600 text-xl" />
            </div> */}
          </div>

          {/* Income List Section */}
          <motion.div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Income List
            </h3>

            {incomes.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No incomes added yet.
              </p>
            ) : (
              <div className="space-y-6 bg-gradient-to-b from-green-50 to-gray-50 p-6 rounded-lg">
                {incomes.map((inc) => (
                  <div
                    key={inc._id}
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all w-full"
                  >
                    {/* Top Section: Main Income Details */}
                    <div className="flex items-center justify-between">
                      {/* Left Side - Income Icon & Details */}
                      <div className="flex items-start space-x-5">
                        {/* Source Icon */}
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-red-400 shadow">
                          {inc?.source?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${inc.source.iconImage}`}
                              alt={inc.source.name || "Category"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Income Details */}
                        <div className="flex flex-col">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {inc?.source?.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {inc.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(inc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Amount & Dropdown Button */}
                      <div className="flex items-center">
                        {/* Income Amount */}
                        <p className="text-xl font-bold text-green-800 mr-8">
                          ₹{inc.amount.toLocaleString()}
                        </p>

                        <motion.button
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: expanded === inc._id ? 180 : 0 }}
                        >
                          <ChevronDown
                            size={18}
                            onClick={() =>
                              setExpanded(inc._id === expanded ? null : inc._id)
                            }
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Dropdown Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === inc._id
                          ? { opacity: 1, height: "auto" }
                          : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">
                          DESCRIPTION : {inc.description}
                        </p>

                        {/* Buttons: Edit & Delete */}
                        <div className="flex justify-end space-x-3 mt-3">
                          <button
                            onClick={() => handleOpenModal(inc)}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                          >
                            <Edit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(inc._id)}
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
              {currentIncome ? "Edit Income" : "Add New Income"}
            </h2>

            {/* Source */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Source
              </label>
              <select
                value={incomeData.source ? incomeData.source.name : ""}
                onChange={handleSourceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              >
                <option value="" disabled>
                  Select Source
                </option>
                {incomeCategories.map((source) => (
                  <option key={source._id} value={source.name}>
                    {source.name}
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
                value={incomeData.amount}
                onChange={(e) =>
                  setIncomeData({
                    ...incomeData,
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
                value={incomeData.description}
                onChange={(e) =>
                  setIncomeData({
                    ...incomeData,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                value={incomeData.date}
                onChange={(e) =>
                  setIncomeData({
                    ...incomeData,
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
                {currentIncome ? "Update Income" : "Add Income"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Income;
