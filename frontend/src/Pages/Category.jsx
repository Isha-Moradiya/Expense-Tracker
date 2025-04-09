import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { ChevronDownIcon, Edit, Edit2, Trash, X } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../layout/Breadcrumbs";
import TopActionBar from "../layout/PageHeader";
const colors = {
  Expense: "text-red-600 border-red-300",
  Income: "text-green-600 border-green-300",
  Investment: "text-blue-600 border-blue-300",
};

function Category() {
  const [categoryType, setCategoryType] = useState("Expense");
  const [name, setName] = useState("");
  const [iconImage, setIconImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState({
    Expense: [],
    Income: [],
    Investment: [],
  });
  const [activeTab, setActiveTab] = useState("Expense");
  const [editCategory, setEditCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  const { authorizationToken } = useAuth();

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchCategoriesByType = async (type) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/category/get-category?type=${type}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      setCategories((prev) => ({ ...prev, [type]: res.data }));
    } catch {
      toast.error(`Failed to fetch ${type} categories!`);
    }
  };

  const fetchAllCategories = async () => {
    await Promise.all(
      ["Expense", "Income", "Investment"].map(fetchCategoriesByType)
    );
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a category name!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryType", categoryType);
    if (iconImage) formData.append("iconImage", iconImage);

    try {
      const endpoint = editCategory
        ? `/api/category/update-category/${editCategory._id}`
        : "/api/category/add-category";
      const method = editCategory ? axios.put : axios.post;

      const response = await method(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        formData,
        {
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      resetForm();
      fetchCategoriesByType(categoryType);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category!");
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setName("");
    setIconImage(null);
    setPreviewImage(null);
    setEditCategory(null);
  };

  //Handle Delete
  const handleDeleteClick = (id) => {
    setDeleteModal(id);
  };

  const confirmDelete = () => {
    handleDeleteCategory(deleteModal);
    setDeleteModal(null);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/category/delete-category/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      toast.success(response.data.message);
      fetchCategoriesByType(categoryType);
    } catch {
      toast.error("Failed to delete category!");
    }
  };

  return (
    <motion.div className="flex-1 mx-auto my-12 max-w-full">
      <div className="px-6">
        {/* Header Section */}
        <div className="flex justify-end items-center mb-6">
          <TopActionBar
            label="Category"
            // onAddClick={() => handleOpenModal(null)}
            // filterDate={filterDate}
            // onDateChange={setFilterDate}
          />
        </div>

        {/* Breadcrums for navigate */}
        <Breadcrumb />

        {/* Category List */}
        <div className="min-h-screen w-full mt-10">
          {/* Tabs */}
          <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mb-6 pb-3">
            {["Expense", "Income", "Investment"].map((type) => {
              const isActive = activeTab === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full border transition-all duration-300 text-sm sm:text-base font-medium shadow-sm ${
                    isActive
                      ? "bg-gray-100 border-gray-600 text-gray-800 shadow-md"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Category List Wrapper */}
          <div>
            <ul className="space-y-4 w-full">
              {categories[activeTab]?.length > 0 ? (
                categories[activeTab].map((category) => (
                  <li
                    key={category._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Icon + Name */}
                    <div className="flex items-center gap-4">
                      {category.iconImage && (
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                              category.iconImage
                            }`}
                            alt="icon"
                            className="w-full h-full object-contain rounded-md transition-transform duration-200 hover:scale-105"
                          />
                        </div>
                      )}
                      <span className="text-gray-800 text-base sm:text-lg font-semibold truncate max-w-[180px] sm:max-w-xs">
                        {category.name}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditCategory(category);
                          setName(category.name);
                          setCategoryType(category.categoryType);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category._id)}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                        title="Delete Category"
                      >
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center py-6 italic">
                  No categories added yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

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
              Are you sure you want to delete this category? This action cannot
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
            onSubmit={handleSaveCategory}
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

            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Category Icon (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setIconImage(file);
                  setPreviewImage(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {previewImage && (
                <div className="flex justify-center mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Category Type Selector */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select Category Type
              </label>
              <select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
                <option value="Investment">Investment</option>
              </select>
            </div>

            {/* Category Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
              >
                {editCategory ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default Category;
