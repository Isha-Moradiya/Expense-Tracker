import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  placeholder,
  searchValue,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between flex-col sm:flex-row">
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 shadow-sm w-full focus-within:border-gray-700">
        <FaSearch className="text-gray-300 text-lg mr-2 transition-colors" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-gray-500"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={(e) =>
            e.target.previousSibling.classList.add("text-gray-700")
          }
          onBlur={(e) =>
            e.target.previousSibling.classList.remove("text-gray-700")
          }
        />
      </div>
    </div>
  );
};

export default SearchBar;
