import React, { useRef } from "react";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";

const TopActionBar = ({ label, onAddClick, filterDate, onDateChange }) => {
  const dateRef = useRef(null);

  return (
    <div className="flex flex-wrap justify-end items-center gap-4 mb-6 w-full">
      {/* Date Picker Button */}
      <div className="relative">
        <button
          onClick={() => {
            dateRef.current?.showPicker?.();
            dateRef.current?.focus();
          }}
          className="p-3 rounded-xl bg-white border border-gray-300 shadow hover:bg-gray-50 hover:border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center items-center"
          aria-label="Filter by date"
        >
          <FaCalendarAlt className="text-gray-700" size={18} />
        </button>

        <input
          ref={dateRef}
          type="date"
          value={filterDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10"
          tabIndex={-2}
        />
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 font-medium border border-gray-300 hover:from-gray-200 hover:to-gray-400 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label={`Add ${label}`}
      >
        <FaPlus size={16} className="text-gray-800" />
        <span className="text-sm sm:text-base font-medium">Add {label}</span>
      </button>
    </div>
  );
};

export default TopActionBar;
