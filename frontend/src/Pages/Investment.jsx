import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaRupeeSign, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, X } from "lucide-react";
import Breadcrumb from "../layout/Breadcrumbs";
import SearchBar from "../layout/SearchBar";
import TopActionBar from "../layout/PageHeader";

const Investment = () => {
  const { authorizationToken } = useAuth();
  const location = useLocation();

  const [investments, setInvestments] = useState([]);
  const [investmentCategories, setInvestmentCategories] = useState([]);

  const [totalInvestments, setTotalInvestments] = useState(0);
  const [withdrawInvestments, setWithdrawInvestments] = useState(0);
  const [remainingInvestments, setRemainingInvestments] = useState(0);
  const [currentInvestment, setCurrentInvestment] = useState(null);
  const [investmentData, setInvestmentData] = useState({
    name: "",
    investmentType: {},
    platform: "",
    currentAmount: "",
    investedAmount: "",
    withdrawnAmount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredInvestments = () => {
    return investments.filter((investment) => {
      if (
        filterDate &&
        (!investment.date || !investment.date.startsWith(filterDate))
      )
        return false;
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        investment.name?.toLowerCase().includes(search) ||
        investment.investmentType?.name?.toLowerCase().includes(search) ||
        investment.platform?.toLowerCase().includes(search) ||
        investment.description?.toLowerCase().includes(search);

      if (searchTerm && !matchesSearch) return false;
      return true;
    });
  };

  const filteredInvestments = getFilteredInvestments();

  // Fetch investment
  const fetchInvestments = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/investment/get-investment`,
        { headers: { Authorization: authorizationToken } }
      );

      setInvestments(data.investments);
      setTotalInvestments(data.totalInvestments);
      setWithdrawInvestments(data.withdrawInvestments);
      setRemainingInvestments(data.remainingInvestments);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch category
  const fetchInvestmentCategories = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/category/get-category?type=Investment`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      setInvestmentCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchInvestmentCategories();
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/investment/delete-investment/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      toast.success("Investment deleted successfully");
      fetchInvestments();
    } catch (error) {
      toast.error("Failed to delete investment.");
    }
  };

  //Handle Open Modal
  const handleOpenModal = (investment) => {
    if (investment) {
      setInvestmentData({
        name: investment.name,
        investmentType: investment.investmentType,
        platform: investment.platform,
        currentAmount: investment.currentAmount,
        investedAmount: investment.investedAmount,
        withdrawnAmount: investment.withdrawnAmount,
        description: investment.description,
        date: investment.date
          ? investment.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setCurrentInvestment(investment);
    } else {
      setInvestmentData({
        name: "",
        investmentType: "",
        platform: "",
        currentAmount: "",
        investedAmount: "",
        withdrawnAmount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setCurrentInvestment(null);
    }
    setShowModal(true);
  };

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedInvestmentData = {
      ...investmentData,
      investmentType: investmentData.investmentType._id,
    };

    try {
      if (currentInvestment) {
        await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/investment/update-investment/${currentInvestment._id}`,
          formattedInvestmentData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Investment updated successfully");
      } else {
        await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/investment/create-investment`,
          formattedInvestmentData,
          { headers: { Authorization: authorizationToken } }
        );
        toast.success("Investment added successfully");
      }

      setShowModal(false);
      fetchInvestments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save investment");
    }
  };

  //Handle InvestmentType Change
  const handleTypeChange = (e) => {
    const selectedType = investmentCategories.find(
      (investmentType) => investmentType.name === e.target.value
    );
    setInvestmentData({
      ...investmentData,
      investmentType: selectedType,
    });
  };

  return (
    <>
      <motion.div className="flex-1 mx-auto my-12 max-w-full">
        <div className="px-6">
          {/* Header Section */}
          <div className="flex justify-end items-center mb-6">
            <TopActionBar
              label="Investment"
              onAddClick={() => handleOpenModal(null)}
              filterDate={filterDate}
              onDateChange={setFilterDate}
            />
          </div>

          {/* Breadcrums for navigate */}
          <Breadcrumb />

          {/* Investment Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Remaining Investment Card */}
            <div className="bg-blue-50 p-5 sm:p-6 rounded-2xl flex items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-200 p-3 rounded-full flex-shrink-0">
                <FaRupeeSign className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4 min-w-0">
                <h3 className="text-sm sm:text-base text-gray-500 truncate">
                  Remaining Investment
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
                  ₹{remainingInvestments.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Withdraw Investments Card */}
            <div className="bg-purple-50 p-5 sm:p-6 rounded-2xl flex items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-200 p-3 rounded-full flex-shrink-0">
                <FaRupeeSign className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4 min-w-0">
                <h3 className="text-sm sm:text-base text-gray-500 truncate">
                  Withdraw Investments
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
                  ₹{withdrawInvestments.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Total Investments Card */}
            <div className="bg-pink-50 p-5 sm:p-6 rounded-2xl flex items-center shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-pink-200 p-3 rounded-full flex-shrink-0">
                <FaRupeeSign className="text-pink-600 text-2xl" />
              </div>
              <div className="ml-4 min-w-0">
                <h3 className="text-sm sm:text-base text-gray-500 truncate">
                  Total Investments
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
                  ₹{totalInvestments.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <SearchBar
            placeholder={"Search Investments..."}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Investment List */}
          <motion.div className="mt-6">
            {filteredInvestments.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No investments added yet.
              </p>
            ) : (
              <div className="space-y-6">
                {filteredInvestments.map((inv) => (
                  <motion.div
                    key={inv._id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all relative"
                  >
                    {/* Chevron Toggle */}
                    <motion.button
                      className="absolute top-0 right-1 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: expanded === inv._id ? 180 : 0 }}
                      onClick={() =>
                        setExpanded(inv._id === expanded ? null : inv._id)
                      }
                    >
                      <ChevronDown size={22} />
                    </motion.button>

                    {/* Main Row */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 flex-wrap">
                      {/* Left Block */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="w-10 h-10 flex-shrink-0">
                          {inv?.investmentType?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${inv.investmentType.iconImage}`}
                              alt={inv.investmentType.name || "Type"}
                              className="w-full h-full object-contain rounded transition-transform duration-200 hover:scale-105"
                            />
                          ) : (
                            <div className="text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col min-w-0">
                          <p className="text-base sm:text-md font-medium text-gray-800 line-clamp-1">
                            {inv.name}
                          </p>
                          <span className="text-sm text-gray-500 mt-1 truncate">
                            {inv?.investmentType?.name} • {inv.platform}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col items-end text-right px-6 sm:px-4 py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Invested Amount:
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                          ₹{inv.investedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === inv._id
                          ? { opacity: 1, height: "auto", marginTop: 16 }
                          : { opacity: 0, height: 0, marginTop: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 bg-gradient-to-br from-gray-50 to-white border-t pt-5 px-4 pb-4 rounded-xl shadow-inner text-sm text-gray-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">💰</span>
                          <span>
                            <span className="font-medium text-gray-600">
                              Current Amount:
                            </span>{" "}
                            ₹{inv.currentAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">📝</span>
                          <span>
                            <span className="font-medium text-gray-600">
                              Description:
                            </span>{" "}
                            {inv.description || "N/A"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex flex-wrap justify-end gap-3">
                          <button
                            onClick={() => handleOpenModal(inv)}
                            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all shadow-sm"
                          >
                            <Edit2
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(inv._id)}
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
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="relative p-10 bg-gradient-to-tr from-blue-100 via-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition transform hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
              {currentInvestment ? "Edit Investment" : "Add New Investment"}
            </h2>

            {/* Investor Name */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Investor Name
              </label>
              <input
                type="text"
                value={investmentData.name}
                onChange={(e) =>
                  setInvestmentData({ ...investmentData, name: e.target.value })
                }
                placeholder="Enter investor's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {/* Investment Type */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Investment Type
              </label>
              <select
                value={
                  investmentData.investmentType
                    ? investmentData.investmentType.name
                    : ""
                }
                onChange={handleTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              >
                <option value="" disabled>
                  Select Investment Type
                </option>
                {investmentCategories.map((InvestmentType) => (
                  <option key={InvestmentType._id} value={InvestmentType.name}>
                    {InvestmentType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Platform
              </label>
              <input
                type="text"
                value={investmentData.platform}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    platform: e.target.value,
                  })
                }
                placeholder="Enter platform (e.g., Zerodha, Real Estate Agent)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {/* Amount Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Current Amount
                </label>
                <input
                  type="number"
                  value={investmentData.currentAmount}
                  onChange={(e) =>
                    setInvestmentData({
                      ...investmentData,
                      currentAmount: e.target.value,
                    })
                  }
                  placeholder="Enter current amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Invested Amount
                </label>
                <input
                  type="number"
                  value={investmentData.investedAmount}
                  onChange={(e) =>
                    setInvestmentData({
                      ...investmentData,
                      investedAmount: e.target.value,
                    })
                  }
                  placeholder="Enter invested amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>
            </div>

            {/* Withdrawn Amount */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Withdrawn Amount
              </label>
              <input
                type="number"
                value={investmentData.withdrawnAmount}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    withdrawnAmount: e.target.value,
                  })
                }
                placeholder="Enter withdrawn amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Description
              </label>
              <textarea
                value={investmentData.description}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    description: e.target.value,
                  })
                }
                placeholder="Enter a brief description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
              ></textarea>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                value={investmentData.date}
                onChange={(e) =>
                  setInvestmentData({ ...investmentData, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6 space-x-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
              >
                {currentInvestment ? "Update Investment" : "Add Investment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Investment;
