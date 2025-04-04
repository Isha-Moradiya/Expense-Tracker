import { NavLink, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import TestimonialSlider from "../components/Testimonial";

const Home = () => {
  return (
    <>
      <div className="w-full bg-gray-900 min-h-screen flex flex-col items-center px-6 md:px-12 pt-8 pb-0  relative overflow-hidden">
        <Header />
        <HeroSection />
      </div>

      <div className="w-full bg-gray-300 ">
        <TestimonialSlider />
      </div>

      <Footer />
    </>
  );
};
export default Home;
