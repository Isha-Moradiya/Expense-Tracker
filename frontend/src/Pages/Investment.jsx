import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaRupeeSign, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Edit2, Trash, X } from "lucide-react";

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
      <motion.div className="flex-1 mx-auto my-12 p-6">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              Investments
            </h2>

            <button
              onClick={() => handleOpenModal(null)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform flex items-center justify-center"
              aria-label="Add Investment"
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
              to="/investment"
              className={`${
                location.pathname === "/investment"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-900"
              }`}
            >
              Investment
            </Link>
          </nav>

          {/* Investment Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-blue-200 p-3 rounded-full">
                <FaRupeeSign className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Remaining Investment</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{remainingInvestments.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-purple-200 p-3 rounded-full">
                <FaRupeeSign className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Withdraw Investments</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{withdrawInvestments.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-pink-200 p-3 rounded-full">
                <FaRupeeSign className="text-pink-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Investments</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{totalInvestments.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search Filter Section */}
          <div className="mb-6">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 shadow-sm w-full focus-within:border-cyan-600">
              <FaSearch className="text-gray-300 text-lg mr-2 focus-within:text-cyan-600" />
              <input
                type="text"
                placeholder="Search investments..."
                className="w-full bg-transparent outline-none text-sm text-gray-500"
                onFocus={(e) =>
                  e.target.previousSibling.classList.add("text-cyan-600")
                }
                onBlur={(e) =>
                  e.target.previousSibling.classList.remove("text-cyan-600")
                }
              />
            </div>
          </div>

          {/* Investment List */}
          <motion.div className="mt-6">
            {investments.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No investments added yet.
              </p>
            ) : (
              <div className="space-y-6 bg-gradient-to-b from-blue-50 to-gray-50 p-6 rounded-lg shadow">
                {investments.map((inv) => (
                  <div
                    key={inv._id}
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all w-full"
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      {/* Left Side - Investment Image & Details */}
                      <div className="flex items-start w-2/3 space-x-5">
                        {/* Investment Icon */}
                        <div className="w-16 h-14 rounded-full overflow-hidden border border-red-400 shadow">
                          {inv?.investmentType?.iconImage ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${inv.investmentType.iconImage}`}
                              alt={inv.investmentType.name || "Category"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Investment Details */}
                        <div className="flex flex-col w-full">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {inv.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {inv?.investmentType?.name} • {inv.platform}
                          </p>

                          {/* Current Amount */}
                          <p className="mt-2 text-sm text-gray-500">
                            Current Amount
                          </p>
                          <p className="text-xl font-bold text-blue-900">
                            ₹{inv.currentAmount.toLocaleString()}
                          </p>

                          {/* Description Field
                      <p className="mt-2 text-sm text-gray-600">Description</p>
                      <p className="text-sm font-medium text-gray-700">
                        {inv.description}
                      </p> */}
                        </div>
                      </div>

                      {/* Right Side - Invested Amount & Dropdown */}
                      <div className="flex flex-col items-end w-1/3">
                        {/* Dropdown Icon */}
                        <motion.button
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: expanded === inv._id ? 180 : 0 }}
                        >
                          <ChevronDown
                            size={18}
                            onClick={() =>
                              setExpanded(inv._id === expanded ? null : inv._id)
                            }
                          />
                        </motion.button>

                        {/* Invested Amount */}
                        <div className="mt-4 text-right">
                          <p className="text-sm text-gray-500">
                            Invested Amount
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            ₹{inv.investedAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Expanded Dropdown Section */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={
                        expanded === inv._id
                          ? { opacity: 1, height: "auto" }
                          : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">
                          Description : {inv.description}
                        </p>

                        {/* Buttons: Edit & Delete */}
                        <div className="flex justify-end space-x-3 mt-3">
                          <button
                            onClick={() => handleOpenModal(inv)}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                          >
                            <Edit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(inv._id)}
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
