import { NavLink, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import TestimonialSlider from "../components/Testimonial";
import FAQComponent from "../components/FAQ";
import FeaturesSection from "../components/Features";
import AboutSection from "../components/About";
import FinanceSection from "../components/FinanceSection";
import AboutUs from "../components/About";

const Home = () => {
  return (
    <>
      <div className="w-full bg-gray-900 min-h-screen flex flex-col items-center px-6 md:px-12 pt-8 pb-0  relative overflow-hidden">
        <Header />
        <HeroSection />
      </div>
      <div className="w-full bg-gray-300 ">
        <FeaturesSection />
      </div>
      <div className="w-full bg-gray-900 ">
        <AboutUs />
      </div>
      <div className="w-full bg-gray-300 ">
        <TestimonialSlider />
      </div>
      <div className="w-full bg-gray-900 ">
        <FAQComponent />
      </div>
      <div className="w-full bg-gray-300 ">
        <FinanceSection />
      </div>
      <Footer />
    </>
  );
};
export default Home;
