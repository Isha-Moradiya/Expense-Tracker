import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSearch, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, TrendingUp, X } from "lucide-react";
import Breadcrumb from "../layout/Breadcrumbs";
import SearchBar from "../layout/SearchBar";
import TopActionBar from "../layout/PageHeader";

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
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredIncomes = () => {
    return incomes.filter((income) => {
      if (filterDate && !income.date.startsWith(filterDate)) return false;

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        income.source?.name?.toLowerCase().includes(search) ||
        income.description?.toLowerCase().includes(search);

      if (searchTerm && !matchesSearch) return false;
      return true;
    });
  };

  const filteredIncomes = getFilteredIncomes();

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
      <motion.div className="flex-1 mx-auto my-12 max-w-full">
        <div className="px-6">
          {/* Header Section */}
          <div className="flex justify-end items-center mb-6">
            <TopActionBar
              label="Income"
              onAddClick={() => handleOpenModal(null)}
              filterDate={filterDate}
              onDateChange={setFilterDate}
            />
          </div>

          {/* Breadcrums for navigate */}
          <Breadcrumb />

          {/* Total Income Section */}
          <div className="mb-7">
            <div className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 p-6 rounded-2xl flex flex-col items-center justify-between shadow-md md:flex-row md:justify-start sm:px-8 sm:py-6 space-y-4 sm:space-y-0 sm:space-x-6 transition-transform duration-300 transform hover:shadow-lg">
              <div className="bg-white p-4 rounded-full text-6xl text-green-600 shadow-lg flex-shrink-0">
                📈
              </div>
              <div className="w-full sm:w-auto text-center sm:text-left md:pt-2 lg:pt-1.5">
                <h3 className="text-sm font-medium text-gray-700 truncate">
                  Total Income
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 truncate">
                  ₹{totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <SearchBar
            placeholder={"Search Income..."}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Income List Section */}
          <motion.div className="mt-6">
            {filteredIncomes.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No incomes added yet.
              </p>
            ) : (
              <div className="space-y-6">
                {filteredIncomes.map((inc) => (
                  <motion.div
                    key={inc._id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all relative"
                  >
                    {/* Chevron Button */}
                    <motion.button
                      className="absolute top-0 right-1 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: expanded === inc._id ? 180 : 0 }}
                      onClick={() =>
                        setExpanded(inc._id === expanded ? null : inc._id)
                      }
                    >
                      <ChevronDown size={22} />
                    </motion.button>

                    {/* Main Row */}
                    <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
                      {/* Left Block */}
                      <div className="flex items-start gap-4 flex-1 min-w-[220px]">
                        {/* Icon/Image */}
                        <div className="w-10 h-10 flex-shrink-0">
                          {inc?.source?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${inc.source.iconImage}`}
                              alt={inc.source.name || "Source"}
                              className="w-full h-full object-contain rounded transition-transform duration-200 hover:scale-105"
                            />
                          ) : (
                            <div className="text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Name & Description */}
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {inc?.source?.name || "No Source"}
                          </p>
                          <span className="text-xs text-gray-500 mt-1">
                            {inc.description || "No description"}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col items-end text-right px-6 py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Amount:
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                          ₹{inc.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === inc._id
                          ? { opacity: 1, height: "auto", marginTop: 16 }
                          : { opacity: 0, height: 0, marginTop: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 bg-gradient-to-br from-green-50 to-white border-t pt-5 px-4 pb-4 rounded-xl shadow-inner text-sm text-gray-700 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500">📅</span>
                          <span>
                            <span className="font-medium text-gray-600">
                              Date:
                            </span>{" "}
                            {new Date(inc.date).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex flex-wrap justify-end gap-3">
                          <button
                            onClick={() => handleOpenModal(inc)}
                            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all shadow-sm"
                          >
                            <Edit2
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(inc._id)}
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
