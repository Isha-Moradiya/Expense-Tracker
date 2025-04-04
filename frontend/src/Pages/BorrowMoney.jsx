import { FaPlus, FaRupeeSign, FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ChevronDown, Edit2, Trash, X } from "lucide-react";

const BorrowMoney = () => {
  const { authorizationToken } = useAuth();
  const location = useLocation();

  const [totalBorrowMoney, setTotalBorrowMoney] = useState(0);
  const [remainingBorrowMoney, setRemainingBorrowMoney] = useState(0);
  const [repaidBorrowMoney, setRepaidBorrowMoney] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [borrowMoneyRecords, setBorrowMoneyRecords] = useState([]);
  const [currentBorrow, setCurrentBorrow] = useState(null);

  const [lenderImage, setLenderImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [borrowData, setBorrowData] = useState({
    borrower: "",
    lender: "",
    lenderEmail: "",
    initialAmount: "",
    remainingAmount: "",
    description: "",
  });

  const [expanded, setExpanded] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  //Fetch Borrow Money Records
  const fetchBorrowMoneyRecords = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/borrow/get-borrow`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      const borrowRecords = response.data.data;
      setBorrowMoneyRecords(borrowRecords);

      // Calculate totals
      let totalInitial = 0;
      let totalRemaining = 0;
      let totalRepaid = 0;
      borrowRecords.forEach((record) => {
        totalInitial += record.initialAmount || 0;
        totalRemaining += record.remainingAmount || 0;
        totalRepaid +=
          (record.initialAmount || 0) - (record.remainingAmount || 0);
      });

      setTotalBorrowMoney(totalInitial);
      setRemainingBorrowMoney(totalRemaining);
      setRepaidBorrowMoney(totalRepaid);
    } catch (error) {
      console.error("Error fetching borrow data:", error);
    }
  };

  useEffect(() => {
    fetchBorrowMoneyRecords();
  }, []);

  //Handle Modal Open
  const handleOpenModal = (borrow) => {
    if (borrow) {
      setBorrowData({
        borrower: borrow.borrower,
        lender: borrow.lender,
        lenderImage: borrow.lenderImage,
        lenderEmail: borrow.lenderEmail,
        initialAmount: borrow.initialAmount || "",
        remainingAmount: borrow.remainingAmount || "",
        description: borrow.description || "",
      });
      setCurrentBorrow(borrow);
    } else {
      setBorrowData({
        borrower: "",
        lender: "",
        lenderImage: "",
        lenderEmail: "",
        initialAmount: "",
        remainingAmount: "",
        description: "",
      });
      setCurrentBorrow(null);
    }
    setLenderImage(null);
    setShowModal(true);
  };

  //Handle Delete
  const handleDeleteClick = (id) => {
    setDeleteModal(id);
  };

  const confirmDelete = () => {
    handleDelete(deleteModal);
    setDeleteModal(null);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/borrow/delete-borrow/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      toast.success("Borrow money record deleted successfully.");
      fetchBorrowMoneyRecords();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete borrow money record:", error);
      toast.error("Failed to delete borrow money record.");
    }
  };

  //Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("borrower", borrowData.borrower);
      formData.append("lender", borrowData.lender);
      formData.append("lenderEmail", borrowData.lenderEmail);
      formData.append("initialAmount", borrowData.initialAmount);
      formData.append("remainingAmount", borrowData.remainingAmount);
      formData.append("description", borrowData.description);
      if (lenderImage) formData.append("lenderImage", lenderImage);

      const config = {
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "multipart/form-data",
        },
      };

      if (currentBorrow) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/borrow/update-borrow/${
            currentBorrow._id
          }`,
          formData,
          config
        );
        toast.success("Borrow money record updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/borrow/create-borrow`,
          formData,
          config
        );
        toast.success("Borrow money record added successfully.");
      }

      setShowModal(false);
      fetchBorrowMoneyRecords();
    } catch (error) {
      console.error("Failed to save borrow money record:", error);
      toast.error("Failed to save borrow money record.");
    }
  };

  //Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLenderImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <>
      <motion.div className="flex-1 mx-auto my-12 p-6">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Borrow Money
            </h2>

            <button
              onClick={() => handleOpenModal(null)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform flex items-center justify-center"
              aria-label="Add Borrow Money"
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
            <Link
              to="/home"
              className={`${
                location.pathname === "/home"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-700"
              }`}
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/borrow-money"
              className={`${
                location.pathname === "/borrow-money"
                  ? "text-cyan-900 font-semibold"
                  : "hover:text-cyan-900"
              }`}
            >
              Borrow-Money
            </Link>
          </nav>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-blue-200 p-3 rounded-full">
                <FaRupeeSign className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">
                  Remaining Borrow Money
                </h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{remainingBorrowMoney.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-purple-200 p-3 rounded-full">
                <FaRupeeSign className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Get Back Money</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{repaidBorrowMoney.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl flex items-center shadow-md">
              <div className="bg-pink-200 p-3 rounded-full">
                <FaRupeeSign className="text-pink-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Borrow Money</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                  ₹{totalBorrowMoney.toLocaleString()}
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
                placeholder="Search borrow money..."
                className="w-full bg-transparent outline-none text-sm text-gray-600"
                onFocus={(e) =>
                  e.target.previousSibling.classList.add("text-cyan-600")
                }
                onBlur={(e) =>
                  e.target.previousSibling.classList.remove("text-cyan-600")
                }
              />
            </div>
          </div>

          {/* Borrow Money List */}
          <motion.div className="space-y-6 bg-gradient-to-b from-blue-50 to-cyan-50 p-6 rounded-lg">
            {borrowMoneyRecords.length === 0 ? (
              <p className="text-center text-gray-600 text-lg italic">
                No borrow records found.
              </p>
            ) : (
              borrowMoneyRecords.map((borrow) => (
                <div
                  key={borrow._id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all w-full"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    {/* Left Side - Lender Image, Name & Remaining Amount */}
                    <div className="flex items-start space-x-5">
                      {/* Lender Image */}
                      <div className="w-14 h-14 flex-shrink-0">
                        <img
                          src={
                            borrow.lenderImage
                              ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                                  borrow.lenderImage
                                }`
                              : "/images/profile-circle.svg"
                          }
                          alt="Lender"
                          className="w-full h-full rounded-full object-cover border border-cyan-400 shadow"
                        />
                      </div>

                      {/* Lender Name & Remaining Amount */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                          {borrow.lender}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Remaining Amount
                        </p>
                        <p className="text-xl font-bold text-cyan-900">
                          ₹{borrow.remainingAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Right Side - Dropdown, Total Amount & Status */}
                    <div className="flex flex-col items-end space-y-3">
                      {/* Dropdown Icon */}
                      <motion.button
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: expanded === borrow._id ? 180 : 0 }}
                      >
                        <ChevronDown
                          size={18}
                          onClick={() =>
                            setExpanded(
                              borrow._id === expanded ? null : borrow._id
                            )
                          }
                        />
                      </motion.button>

                      {/* Total Borrowed Amount */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Borrowed</p>
                        <p className="text-xl font-bold text-blue-900">
                          ₹{borrow.initialAmount.toLocaleString()}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                          borrow.remainingAmount > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {borrow.remainingAmount > 0 ? "Unpaid" : "Paid"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Dropdown Section */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={
                      expanded === borrow._id
                        ? { opacity: 1, height: "auto" }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mt-4 border-t pt-4 bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700">
                        Description : {borrow.description}
                      </p>

                      {/* Buttons: Edit & Delete */}
                      <div className="flex justify-end space-x-3 mt-3">
                        <button
                          onClick={() => handleOpenModal(borrow)}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                        >
                          <Edit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(borrow._id)}
                          className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))
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
            className="relative p-8 md:p-10 bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition hover:scale-110"
            >
              <X className="w-7 h-7" />
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {currentBorrow ? "Edit Borrow Money" : "Add New Borrow Money"}
            </h2>

            {/* Borrower Name Input */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Borrower Name:
              </label>
              <input
                type="text"
                name="borrower"
                value={borrowData.borrower}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, borrower: e.target.value })
                }
                placeholder="Enter borrower's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                required
              />
            </div>

            {/* File Input & Image Preview */}
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2">
                Upload Lender Image (optional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {previewImage && (
                <div className="flex justify-center mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Lender Name Input */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Lender Name:
              </label>
              <input
                type="text"
                name="lender"
                value={borrowData.lender}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, lender: e.target.value })
                }
                placeholder="Enter lender's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                required
              />
            </div>

            {/* Lender Email Input */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Lender Email:
              </label>
              <input
                type="email"
                name="lenderEmail"
                value={borrowData.lenderEmail}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, lenderEmail: e.target.value })
                }
                placeholder="Enter lender's email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                required
              />
            </div>

            {/* Amount Inputs (Grid Layout) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Borrowed Amount:
                </label>
                <input
                  type="number"
                  name="initialAmount"
                  value={borrowData.initialAmount}
                  onChange={(e) =>
                    setBorrowData({
                      ...borrowData,
                      initialAmount: e.target.value,
                    })
                  }
                  placeholder="Enter initial amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Remaining Amount:
                </label>
                <input
                  type="number"
                  name="remainingAmount"
                  value={borrowData.remainingAmount}
                  onChange={(e) =>
                    setBorrowData({
                      ...borrowData,
                      remainingAmount: e.target.value,
                    })
                  }
                  placeholder="Enter remaining amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                  required
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Description:
              </label>
              <textarea
                name="description"
                value={borrowData.description}
                onChange={(e) =>
                  setBorrowData({ ...borrowData, description: e.target.value })
                }
                placeholder="Enter a brief description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 resize-none"
              />
            </div>

            {/* Buttons (Save & Delete with 50-50 width) */}
            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
              >
                {currentBorrow ? "Update Borrow" : "Save Borrow"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default BorrowMoney;
