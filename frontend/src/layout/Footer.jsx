import {
  FaSquareInstagram,
  FaSquareTwitter,
  FaSquareYoutube,
} from "react-icons/fa6";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";

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
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Copyright */}
          <p className="text-gray-400">
            © {new Date().getFullYear()} eluxspace. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 text-gray-400">
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

          {/* Tagline */}
          <p className="text-gray-300">Smarter Money. Better Future.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
