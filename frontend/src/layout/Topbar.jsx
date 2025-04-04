import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, X } from "lucide-react";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";

const Topbar = () => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const { isLoggedIn, LogoutUser, user } = useAuth();

  const handleEditProfile = () => {
    setUpdatedUser({
      name: user?.name,
      email: user?.email,
      photo: user?.photo,
    });
    setEditProfileModalOpen(true);
  };

  const closeEditProfileModal = () => {
    setEditProfileModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedUser({ ...updatedUser, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
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

      closeEditProfileModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    LogoutUser();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 flex items-center justify-between shadow-md w-full sticky top-0 z-50">
      {/* Logo */}
      <Logo />

      {/* Search Bar */}
      <div className="relative w-80 hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-full bg-gray-700 text-gray-200 focus:outline-none shadow-sm"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Icons & Profile */}
      <div className="flex items-center space-x-6">
        <Bell
          className="text-gray-300 hover:text-white cursor-pointer"
          size={20}
        />
        <div className="relative">
          {isLoggedIn ? (
            <div
              className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <img
                src={
                  user?.photo
                    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        user.photo
                      }`
                    : "/images/profile-circle.svg"
                }
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-500 object-cover"
              />
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-gradient-to-r from-cyan-900 to-blue-800 px-4 py-2 rounded-lg text-white hover:opacity-80 transition"
            >
              Login
            </NavLink>
          )}

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && isLoggedIn && (
            <div className="absolute top-12 right-0 bg-gray-800 text-white w-64 rounded-lg shadow-xl p-5 z-50">
              <button
                onClick={() => setProfileDropdownOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <div className="text-center">
                <img
                  src={
                    user?.photo
                      ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                          user.photo
                        }`
                      : "/images/profile-circle.svg"
                  }
                  alt="User"
                  className="w-16 h-16 rounded-full border-2 border-cyan-500 mx-auto"
                />
                <p className="mt-2 text-lg font-semibold text-cyan-400">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <hr className="my-4 border-gray-600" />
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center justify-center px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition"
                >
                  <FaUserEdit className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {isEditProfileModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center z-50">
              <form
                onSubmit={handleFormSubmit}
                className="bg-gradient-to-br from-blue-50 via-white to-gray-100 max-w-md w-full p-8 rounded-2xl shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeEditProfileModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition hover:scale-110"
                >
                  <X className="w-7 h-7" />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                  Edit Profile
                </h2>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-4">
                  <label htmlFor="photo" className="relative cursor-pointer">
                    <img
                      src={
                        photoPreview ||
                        (user?.photo
                          ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                              user.photo
                            }`
                          : "/images/default-profile.png")
                      }
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 3a1 1 0 011-1h10a1 1 0 011 1v1H4V3zm6 9a3 3 0 110-6 3 3 0 010 6zm6 3v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1h12z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      id="photo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-700 mt-2">
                    Click to change profile picture
                  </p>
                </div>

                {/* Input Fields */}
                <div className="mb-4">
                  <label className="block text-gray-800 font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-gray-700"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-800 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-gray-700"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
