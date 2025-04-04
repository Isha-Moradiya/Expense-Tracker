import React, { useState } from "react";
import {
  Landmark,
  Coins,
  Wallet,
  IndianRupee,
  LayoutDashboard,
  PiggyBank,
  ListPlus,
} from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, LogoutUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-4 flex flex-col shadow-xl rounded-r-3xl relative transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-5 -right-5 bg-cyan-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-cyan-500 transition duration-300 transform hover:scale-105"
      >
        <span
          className={`transition-transform duration-300 text-white ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
        >
          {isCollapsed ? "☰" : "✖"}
        </span>
      </button>

      {/* Menu Section */}
      <div className="flex-1 space-y-2 mt-14">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "gap-4 px-4"
              } py-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-blue-300 hover:bg-gray-700 hover:bg-opacity-40"
              } hover:shadow-md hover:scale-105`
            }
          >
            {item.icon}
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 w-auto"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className={`flex items-center text-xl font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 ${
            isCollapsed
              ? "justify-center w-10 h-10 p-0 m-0"
              : "w-full px-4 py-3"
          }`}
        >
          <FaSignOutAlt size={24} className="text-blue-300" />
          <span
            className={`ml-3 transition-all duration-300 ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
            style={{
              transition: "opacity 0.3s ease, width 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
