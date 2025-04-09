import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Store/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const IncomeExpenseTotalChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

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
    <div className="my-4 sm:my-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 text-center sm:text-left">
          Total Income vs. Total Expense
        </h2>

        <input
          type="month"
          value={`${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}`}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-fit"
        />
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D1D5DB",
                borderRadius: 8,
                padding: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
            />
            <Legend
              wrapperStyle={{
                color: "#374151",
                fontSize: "13px",
              }}
            />
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
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseTotalChart;
