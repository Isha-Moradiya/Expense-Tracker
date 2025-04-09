import React, { useState, useEffect } from "react";
import {
  Landmark,
  Coins,
  Wallet,
  IndianRupee,
  LayoutDashboard,
  PiggyBank,
  ListPlus,
  X,
} from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import Logo from "../components/Logo";

const Sidebar = ({ isMobile, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { isLoggedIn, LogoutUser } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={24} />,
    },
    { path: "/expense", label: "Expense", icon: <IndianRupee size={24} /> },
    { path: "/income", label: "Income", icon: <Wallet size={24} /> },
    { path: "/investment", label: "Investment", icon: <Landmark size={24} /> },
    { path: "/lent-money", label: "LentMoney", icon: <Coins size={24} /> },
    {
      path: "/borrow-money",
      label: "BorrowMoney",
      icon: <PiggyBank size={24} />,
    },
    { path: "/category", label: "Category", icon: <ListPlus size={24} /> },
  ];

  const handleLogout = () => {
    LogoutUser();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-4 flex flex-col fixed z-[60] top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out ${
        isMobile ? "translate-x-0" : ""
      }`}
    >
      {/* Close Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-red-500 z-50"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Logo */}
      <div className="mb-10 p-2">
        <Logo />
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-blue-300 hover:bg-gray-700 hover:bg-opacity-40"
              } hover:shadow-md hover:scale-105`
            }
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      {isLoggedIn && (
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 text-base sm:text-lg font-medium rounded-lg text-blue-300 px-4 py-3 transition-all duration-300 hover:scale-105 hover:bg-gray-700 hover:bg-opacity-40"
        >
          <FaSignOutAlt size={22} className="group-hover:rotate-[-15deg]" />
          <span>Logout</span>
        </button>
      )}

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
    </div>
  );
};

export default Sidebar;
