import { Button } from "../components/ui/Button";
import { MenuIcon, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <section className="w-full">
        {/* Header */}
        <header className="relative w-full max-w-screen-xl bg-white/15 rounded-full shadow-md px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between mx-auto z-50">
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
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 text-gray-200 font-medium items-center">
            <NavLink to="/#feature" className="hover:text-cyan-400">
              Features
            </NavLink>
            <NavLink to="/#about" className="hover:text-cyan-400">
              About
            </NavLink>
            <NavLink to="/#testimonial" className="hover:text-cyan-400">
              Testimonials
            </NavLink>
            <NavLink to="/#faq" className="hover:text-cyan-400">
              FAQs
            </NavLink>

            <Button
              className="border border-white text-white px-6 py-2 rounded-full hover:scale-105 transition duration-300"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </nav>
        </header>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed top-25 left-0 right-0 w-full px-4 z-50 md:hidden transition-all duration-300">
            <nav className="flex flex-col space-y-4 bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 rounded-2xl p-6 mx-4 mt-2">
              <NavLink
                to="/#feature"
                className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </NavLink>
              <NavLink
                to="/#about"
                className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/#testimonial"
                className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </NavLink>
              <NavLink
                to="/#faq"
                className="text-base font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </NavLink>

              <Button
                className="border border-white text-white text-lg font-medium px-6 py-2 rounded-full shadow-md hover:scale-110 transition-all duration-300"
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </nav>
          </div>
        )}
      </section>
    </>
  );
};
export default Header;
