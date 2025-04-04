export default function AboutUs() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-24 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 sm:gap-16">
        {/* Left - Image */}
        <div className="relative group w-full max-w-3xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-xl transform transition-transform duration-500 group-hover:scale-105">
            <img
              src="/images/About2.jpg"
              alt="Team working on expense tracker"
              className="w-full h-auto object-cover rounded-3xl"
            />
          </div>

          {/* Soft gradient glow behind image */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-blue-100 via-transparent to-blue-200 blur-2xl opacity-40 group-hover:opacity-60 transition duration-500" />
        </div>

        {/* Right - Text Content */}
        <div className="text-center md:text-left">
          <span className="text-gray-300 font-semibold text-base sm:text-lg lg:text-xl block mb-2">
            About Us
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white/80 drop-shadow-md mb-4 leading-snug sm:leading-tight">
            Smarter Expense Management,
            <br className="hidden sm:block" />
            Brighter Financial Future
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed sm:leading-relaxed max-w-2xl mx-auto md:mx-0">
            Our Expense Tracker helps you track, analyze, and optimize your
            finances effortlessly. Whether you're budgeting solo or splitting
            group expenses, we've built the tools to simplify your financial
            life.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              ["5+ Years", "of simplifying financial planning"],
              ["10,000+ Users", "trust our platform daily"],
              ["₹100 Cr+ Tracked", "across all user accounts"],
              ["98% Satisfaction", "from financially empowered users"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl shadow-sm p-5 border border-blue-100 hover:shadow-md transition duration-300"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-1">
                  {title}
                </h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
