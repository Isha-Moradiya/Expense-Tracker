import React from "react";
import { Bell, Menu } from "lucide-react";
import ProfileMenu from "../components/Profile";
import { useLocation } from "react-router-dom";

const Topbar = ({ isMobile, isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathMap = {
      "/dashboard": "Dashboard",
      "/expense": "Expenses",
      "/income": "Income",
      "/investment": "Investments",
      "/lent-money": "Lent",
      "/borrow-money": "Borrowed",
      "/category": "Category",
    };
    return pathMap[pathname] || "Page";
  };

  return (
    <div
      className="fixed top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 shadow-md transition-all duration-300 w-full"
      style={{
        left: !isMobile && isSidebarOpen ? "256px" : 0,
        width: !isMobile && isSidebarOpen ? "calc(100% - 256px)" : "100%",
        height: "64px",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Icon: only show when sidebar is hidden */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 whitespace-nowrap">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-1.5 rounded-md bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:outline-none focus:ring focus:ring-sky-500 w-48"
        />
        <Bell className="text-white cursor-pointer w-5 h-5 sm:w-6 sm:h-6" />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Topbar;
