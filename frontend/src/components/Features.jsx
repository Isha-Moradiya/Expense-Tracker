export default function FeaturesSection() {
  const features = [
    {
      title: "Total Expense & Income Tracking",
      description:
        "Real-time tracking of all expenses and income sources with category-wise breakdown.",
      image: "/images/Tracking.jpg",
    },
    {
      title: "Investment Management",
      description: "Track investments and returns to manage finances better.",
      image: "/images/Investment.jpg",
    },
    {
      title: "Loan & Borrow Tracking",
      description: "Keep records of money lent or borrowed with due dates.",
      image: "/images/Loan&Borrow.jpg",
    },
    {
      title: "Recurring Expense Management",
      description: "Easily manage monthly recurring bills and subscriptions.",
      image: "/images/Recurring.avif",
    },
  ];

  return (
    <section className="conatiner py-12 px-4 sm:px-6 md:px-10 lg:px-20">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow-md">
          Powerful Features
        </h3>
        <p className="text-base sm:text-lg text-gray-700">
          Discover the key features that make our expense tracker smart, simple,
          and effective.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-7 sm:gap-8 lg:gap-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-900  shadow-lg rounded-2xl border border-white/30 p-3 sm:p-5 md:p-6 lg:p-8 transition-transform transform hover:scale-103 hover:shadow-2xl text-gray-800 h-full min-h-[340px] flex flex-col justify-start"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl shadow-xl mb-6 mx-auto overflow-hidden transition-transform hover:scale-105">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            <h3 className="text-xl font-bold sm:text-xl text-gray-200 mt-3 mb-2.5 text-center">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-2 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
