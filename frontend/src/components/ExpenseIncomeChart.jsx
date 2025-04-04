import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../Store/auth";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const IncomeExpenseTotalChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const month = selectedDate.getMonth() + 1; // Extract month (1-based)
        const year = selectedDate.getFullYear(); // Extract year

        const incomeResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/income/total-income?month=${month}&year=${year}`,
          { headers: { Authorization: authorizationToken } }
        );

        const expenseResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/expense/total-expense?month=${month}&year=${year}`,
          { headers: { Authorization: authorizationToken } }
        );

        setData([
          { name: "Total Income", value: incomeResponse.data.totalIncome || 0 },
          {
            name: "Total Expense",
            value: expenseResponse.data.totalExpense || 0,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch income and expense totals:", error);
      }
    };

    fetchTotals();
  }, [selectedDate]);

  return (
    <div className="m-6 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200">
      {/* Header with Date Picker aligned to the right */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 text-center md:text-left">
          Total Income vs. Total Expense
        </h2>

        {/* Date Picker (Aligned Right) */}
        <div className="flex justify-center items-center mb-4">
          <input
            type="month"
            value={`${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, "0")}`}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center ">
        <BarChart
          width={650}
          height={350}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#374151", fontSize: 14, fontWeight: "bold" }}
          />
          <YAxis tick={{ fill: "#374151", fontSize: 14, fontWeight: "bold" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#D1D5DB",
              borderRadius: 8,
              padding: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            cursor={{ fill: "rgba(79, 70, 229, 0.1)" }} // Light hover effect
          />
          <Legend wrapperStyle={{ color: "#374151", fontSize: "14px" }} />
          <Bar
            dataKey="value"
            name="Income & Expense"
            fill="url(#colorUv)"
            radius={[10, 10, 0, 0]}
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </div>
    </div>
  );
};

export default IncomeExpenseTotalChart;
