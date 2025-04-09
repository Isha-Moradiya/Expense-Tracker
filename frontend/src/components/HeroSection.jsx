import { Button } from "../components/ui/Button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function HeroSection() {
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
    <div className="w-full">
      <section className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center mt-16">
          <motion.h1
            className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="block">
              <span className="bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                Effortless Expense Tracking,
              </span>
            </span>
            <span className="block">
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                Powerful Insights.
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10"
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
            Expense Tracker helps you control spending, track income, and manage
            savings with an intuitive financial dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              className="bg-gradient-to-r from-cyan-900 to-blue-700 text-white px-8 py-2.5 rounded-full shadow-lg hover:scale-105 transition duration-300 font-bold"
              onClick={handleGetStarted}
            >
              <span className="flex items-center justify-center gap-2">
                Try it free <ArrowRight />
              </span>
            </Button>
          </motion.div>

          <motion.div
            className="relative mx-auto mt-16 max-w-8xl rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src="/images/heroImage.webp"
                alt="Finance illustration"
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />

              {/* Subtle light gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/5 pointer-events-none" />

              {/* Glow on hover */}
              <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
