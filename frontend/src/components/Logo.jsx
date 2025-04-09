import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Logo({ isCollapsed }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // lg breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showCollapsed = isCollapsed && isDesktop;

  return (
    <NavLink
      to="/"
      aria-label="Go to Home"
      className={`flex items-center transition-all duration-300 ${
        showCollapsed ? "justify-center" : "gap-2 lg:gap-3"
      } text-white font-bold text-lg lg:text-2xl`}
    >
      {/* Logo Badge */}
      <div className="bg-gradient-to-br from-gray-800 to-cyan-700 text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center shadow-md text-base lg:text-xl font-extrabold">
        Ex
      </div>

      {/* Logo Text */}
      {!showCollapsed && (
        <span className="text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.4)] tracking-wide transition-opacity duration-300 whitespace-nowrap">
          Expensia
        </span>
      )}
    </NavLink>
  );
}
