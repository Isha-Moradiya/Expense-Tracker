import { Button } from "../components/ui/Button";
import { MenuIcon } from "lucide-react";
import { useAuth } from "../Store/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <section className="w-full">
        {/* Header */}
        <header className="relative container bg-white/15  rounded-full shadow-md px-8 py-4 flex items-center justify-between  mx-auto">
          {/* Logo */}
          <Logo />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-50 font-bold"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-6 w-6 " />
          </Button>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 text-gray-200 font-medium items-center">
            <NavLink to="/feature" className="hover:text-cyan-400">
              Features
            </NavLink>
            <NavLink to="/about" className="hover:text-cyan-400">
              About
            </NavLink>
            <NavLink to="/testimonial" className="hover:text-cyan-400">
              Testimonials
            </NavLink>
            <NavLink to="/faq" className="hover:text-cyan-400">
              FAQs
            </NavLink>

            {/* Get Started Button */}
            <Button
              className="bg-gradient-to-r from-cyan-900 to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition duration-300"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-15 left-4 right-4 p-4 md:hidden z-50 transition-all duration-300">
              <nav className="flex flex-col space-y-4 bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 rounded-2xl p-6">
                <NavLink
                  to="/feature"
                  className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Features
                </NavLink>
                <NavLink
                  to="/about"
                  className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  About
                </NavLink>
                <NavLink
                  to="/testimonial"
                  className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Testimonials
                </NavLink>
                <NavLink
                  to="/faq"
                  className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  FAQs
                </NavLink>

                <Button
                  className="bg-gradient-to-r from-cyan-900 to-blue-800 text-white text-lg font-medium px-6 py-3 rounded-full shadow-md hover:scale-110 transition-all duration-300"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </nav>
            </div>
          )}
        </header>
      </section>
    </>
  );
};
export default Header;
