import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <NavLink
      to="/"
      className="flex items-center gap-3 sm:gap-4 text-white font-bold text-xl sm:text-2xl"
    >
      {/* Logo Badge (Ex) */}
      <div className="bg-gradient-to-br from-gray-700 to-blue-600 text-white rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg text-lg sm:text-xl font-extrabold">
        Ex
      </div>

      {/* Logo Text with Shadow */}
      <span className="text-white -ml-1.5 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.4)]">
        Expensia
      </span>
    </NavLink>
  );
}
