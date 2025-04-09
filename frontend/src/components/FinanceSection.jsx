import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { Button } from "./ui/Button";

const FinanceSection = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <section className="relative w-full py-12 flex justify-center items-center">
      <div className="relative w-[90%] max-w-6xl bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl py-20 px-10 text-center overflow-hidden">
        {/* Glowing Light Effect (Gray-based) */}
        <div className="absolute -left-10 top-0 w-40 h-40 bg-gradient-to-r from-gray-300 to-gray-500 blur-3xl opacity-40"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-white text-4xl sm:text-4xl font-bold">
            Take Charge of Your Finances Today!
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
            Join thousands of users who trust Expensia for smarter money
            management.
          </p>

          {/* Glowing Button (Gray Highlight) */}
          <Button
            className="relative mt-10 px-8 py-3 bg-white text-black font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-300 before:to-gray-500 before:blur-lg before:opacity-50"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinanceSection;
