import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../Store/auth";

const Slider = () => {
  const { authorizationToken } = useAuth();
  const [cardData, setCardData] = useState([
    { title: "Total Expenses", amount: 0, change: "", icon: "📉" },
    { title: "Total Income", amount: 0, change: "", icon: "📈" },
    { title: "Investments", amount: 0, change: "", icon: "🏦" },
    { title: "Lent Money", amount: 0, change: "", icon: "🪙" },
    { title: "Borrowed Money", amount: 0, change: "", icon: "💸" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.allSettled([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/expense/get-expense`,
            {
              headers: { Authorization: authorizationToken },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/income/get-income`,
            {
              headers: { Authorization: authorizationToken },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/investment/get-investment`,
            {
              headers: { Authorization: authorizationToken },
            }
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/lent/get-lent`, {
            headers: { Authorization: authorizationToken },
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/borrow/get-borrow`,
            {
              headers: { Authorization: authorizationToken },
            }
          ),
        ]);

        const getData = (index, key) =>
          responses[index].status === "fulfilled"
            ? responses[index].value?.data?.[key] ?? 0
            : 0;

        setCardData([
          {
            title: "Total Expenses",
            amount: getData(0, "totalExpense"),
            change: getData(0, "change"),
            icon: "📉",
          },
          {
            title: "Total Income",
            amount: getData(1, "totalIncome"),
            change: getData(1, "change"),
            icon: "📈",
          },
          {
            title: "Investments",
            amount: getData(2, "totalInvestments"),
            change: "",
            icon: "🏦",
          },
          {
            title: "Lent Money",
            amount: getData(3, "totalInitialAmount"),
            change: "",
            icon: "🪙",
          },
          {
            title: "Borrowed Money",
            amount: getData(4, "totalBorrowedAmount"),
            change: "",
            icon: "💸",
          },
        ]);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    }

    fetchData();
  }, [authorizationToken]);

  return (
    <div className="py-6 px-4 sm:px-6">
      <Swiper
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="mySwiper"
      >
        {cardData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-2xl border border-gray-300 shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-[1.02] p-6 mx-auto min-h-[200px] flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-2xl mb-4 shadow ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                }`}
              >
                {item.icon}
              </div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-2">
                {item.title}
              </p>
              <h2 className="text-3xl font-extrabold text-gray-800 mt-2 tracking-tight">
                ₹ {item.amount.toLocaleString()}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
