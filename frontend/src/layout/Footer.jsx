import {
  FaSquareInstagram,
  FaSquareTwitter,
  FaSquareYoutube,
} from "react-icons/fa6";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo and Tagline */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-400 text-lg leading-relaxed">
              Start managing your money smarter and <br />
              achieve your financial goals with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {["Home", "Features", "About", "Testimonials", "FAQs"].map(
                (item) => (
                  <li key={item}>
                    <NavLink
                      to="#"
                      className="hover:text-white transition duration-300"
                    >
                      {item}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Resources</h3>
            <ul className="space-y-2 text-gray-400">
              {[
                "Help Center",
                "FAQs",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((item) => (
                <li key={item}>
                  <NavLink
                    to="#"
                    className="hover:text-white transition duration-300"
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col gap-4 sm:gap-6 md:flex-row md:justify-between md:items-center text-sm">
          {/* Left: Copyright */}
          <p className="text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} eluxspace. All rights reserved.
          </p>

          {/* Center: Social Icons */}
          <div className="flex justify-center space-x-4 text-gray-400">
            {[
              { icon: <FaSquareTwitter size={20} />, label: "Twitter" },
              { icon: <FaLinkedin size={20} />, label: "LinkedIn" },
              { icon: <FaGithubSquare size={20} />, label: "GitHub" },
              { icon: <FaSquareInstagram size={20} />, label: "Instagram" },
              { icon: <FaSquareYoutube size={20} />, label: "YouTube" },
            ].map((social, index) => (
              <NavLink
                key={index}
                to="#"
                className="hover:text-white transition duration-300"
              >
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right: Tagline + Scroll to Top */}
          <div className="flex justify-center md:justify-end items-center gap-4">
            <p className="text-gray-300 text-center md:text-right">
              Smarter Money. Better Future.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 text-white bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
