import React, { useEffect, useRef, useState } from "react";
import { X, Settings } from "lucide-react";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const dropdownRef = useRef(null);
  const { isLoggedIn, LogoutUser, user, authorizationToken } = useAuth();
  const navigate = useNavigate();

  const getPhotoUrl = () =>
    user?.photo
      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${user.photo}`
      : "/images/profile-circle.svg";

  const handleEditProfile = () => {
    setUpdatedUser({
      name: user?.name,
      email: user?.email,
      photo: user?.photo,
    });
    setEditModalOpen(true);
    setDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedUser({ ...updatedUser, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", updatedUser.name);
      formData.append("email", updatedUser.email);
      if (updatedUser.photo) formData.append("photo", updatedUser.photo);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/${user._id}`,
        formData,
        {
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    LogoutUser();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {isLoggedIn ? (
        <div
          className="cursor-pointer hover:bg-gray-700 p-1 rounded-full"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <img
            src={getPhotoUrl()}
            alt="User"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border object-cover"
          />
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-500 px-3 py-1 sm:px-4 sm:py-2 text-white rounded hover:opacity-80 text-sm sm:text-base"
        >
          Login
        </button>
      )}

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-12 w-60 sm:w-64 bg-white text-black rounded shadow p-5 z-50 transition-all duration-300 transform ${
          isDropdownOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
      >
        <button
          onClick={() => setDropdownOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-2">
          <img
            src={getPhotoUrl()}
            alt="User"
            className="w-16 h-16 rounded-full border mx-auto object-cover"
          />
          <p className="mt-2 font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        </div>

        <hr className="my-4" />
        <div className="flex flex-col gap-3">
          <button
            onClick={handleEditProfile}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            <FaUserEdit className="mr-2" /> Edit Profile
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative p-10 bg-gradient-to-tr from-red-50 via-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-md">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X className="w-7 h-7" />
            </button>
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout? This will end your session.
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={handleLogout}
                className="px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow relative overflow-y-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
              Edit Profile
            </h2>

            <div className="flex flex-col items-center mb-4">
              <label htmlFor="photo" className="relative cursor-pointer">
                <img
                  src={photoPreview || getPhotoUrl()}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full border object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white">
                  <Settings size={16} />
                </div>
                <input
                  type="file"
                  id="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-600 mt-2">Click to change</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
