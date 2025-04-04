import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";

const testimonials = [
  {
    name: "Raj Patel",
    role: "Small Business Owner",
    feedback:
      "Using this expense tracker, I can easily monitor my spending habits and make informed financial decisions.",
    image: "/images/user1.jpeg",
  },
  {
    name: "Ayesha Khan",
    role: "Freelancer",
    feedback:
      "The budget tracking and savings insights have been a game-changer for me. This app simplifies everything!",
    image: "/images/user2.jpg",
  },
  {
    name: "Vikram Mehta",
    role: "IT Professional",
    feedback:
      "I love the design and the automatic expense categorization. It helps me stay on top of my finances.",
    image: "/images/user3.jpg",
  },
  {
    name: "Karishma Shah",
    role: "Bank Manager",
    feedback:
      "I love the design and the automatic expense categorization. It helps me stay on top of my finances.",
    image: "/images/user2.jpg",
  },
  {
    name: "John Smith",
    role: "Project Manager",
    feedback:
      "I love the design and the automatic expense categorization. It helps me stay on top of my finances.",
    image: "/images/user3.jpg",
  },
];

export default function TestimonialSlider() {
  return (
    <div className="container mx-auto py-16 px-6 text-gray-100">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow-md">
          Smart Expense Tracking,
          <br className="hidden sm:block" /> Smarter Savings
        </h2>
        <p className="text-lg text-gray-400">
          Discover how our users are gaining control over their finances with
          ease.
        </p>
      </div>

      {/* Swiper Section */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
        className="max-w-7xl mx-auto px-2"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-600 mb-4"
                />
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
              <p className="text-base italic text-center text-gray-300 mt-6">
                “{testimonial.feedback}”
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
