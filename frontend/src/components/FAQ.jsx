import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";

const faqs = [
  {
    question:
      "Is this expense tracker suitable for personal and group expenses?",
    answer:
      "Yes, our platform supports both individual expense tracking and group expense splitting for trips and shared expenses.",
  },
  {
    question: "What types of expenses can I track?",
    answer:
      "You can track daily expenses, income, investments, borrowed and lent money, recurring expenses, and more.",
  },
  {
    question: "Can I set spending limits and get alerts?",
    answer:
      "Yes, you can set monthly or category-wise spending limits, and the platform will notify you when you exceed them.",
  },
  {
    question: "Does this platform support multiple payment methods?",
    answer:
      "Yes, you can log expenses paid via cash, card, UPI, and other digital payment methods.",
  },
  {
    question: "Can I upload bills and receipts for my expenses?",
    answer:
      "Yes, our platform allows you to attach receipts and bills to your expenses for easy record-keeping.",
  },
  {
    question: "Does the platform support multi-currency transactions?",
    answer:
      "Yes, you can add expenses in different currencies and track conversions if needed.",
  },
  {
    question: "Is my financial data secure on this platform?",
    answer:
      "Absolutely! We use industry-standard encryption and data security protocols to keep your information safe.",
  },
  {
    question: "Can I generate reports and analyze my spending trends?",
    answer:
      "Yes, our platform provides detailed reports and insights on your spending patterns, helping you manage your finances better.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" py-12 px-4 sm:px-6 md:px-10 lg:px-20 bg-gray-900">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 text-white/80 drop-shadow-md">
          Frequently Asked Questions
        </h2>
        <p className="text-base sm:text-lg text-gray-300">
          Find answers to the most common questions about our expense tracker.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6  max-w-7xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`relative transition-all duration-300 rounded-xl border border-gray-700 bg-white/90 hover:bg-white shadow-md hover:shadow-lg cursor-pointer p-5 sm:p-6`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {faq.question}
              </h3>
              {openIndex === index ? (
                <Minus className="text-gray-800 transition-transform duration-200" />
              ) : (
                <Plus className="text-gray-800 transition-transform duration-200" />
              )}
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden text-sm sm:text-base ${
                openIndex === index
                  ? "max-h-[200px] opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
