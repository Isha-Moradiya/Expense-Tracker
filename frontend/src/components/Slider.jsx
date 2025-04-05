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
    <div className="p-6 overflow-hidden">
      <Swiper spaceBetween={24} slidesPerView={4} className="mySwiper">
        {cardData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`p-5 rounded-full text-4xl mb-4 shadow-md ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-r from-teal-500 to-teal-700 text-white"
                  }`}
                >
                  {item.icon}
                </div>

                <h3 className="text-gray-600 text-xs uppercase tracking-widest">
                  {item.title}
                </h3>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  ₹ {item.amount.toLocaleString()}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
