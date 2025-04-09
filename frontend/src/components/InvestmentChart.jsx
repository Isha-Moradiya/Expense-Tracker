import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useAuth } from "../Store/auth";

const InvestmentBarChart = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const { authorizationToken } = useAuth();

  // Fetch chart data based on selected month and year
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/investment/investment-chart?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      )
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [month, year]);

  // Handle month and year changes
  const handleMonthChange = (e) => setMonth(Number(e.target.value));
  const handleYearChange = (e) => setYear(Number(e.target.value));

  return (
    <div className="my-4 sm:my-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 text-center sm:text-left">
          Investment Overview
        </h2>

        {/* Date Filter Section */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center">
            <label htmlFor="month" className="mr-2 text-gray-600">
              Month:
            </label>
            <select
              id="month"
              value={month}
              onChange={handleMonthChange}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-fit"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="year" className="mr-2 text-gray-600">
              Year:
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-fit"
            >
              {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Investment Bar Chart */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
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
              dataKey="Invested"
              name="Invested"
              fill="#34D399" // Green color for invested
              radius={[10, 10, 0, 0]}
            >
              <LabelList
                dataKey="Invested"
                position="top"
                fill="#FFF"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="Withdrawn"
              name="Withdrawn"
              fill="#F87171" // Red color for withdrawn
              radius={[10, 10, 0, 0]}
            >
              <LabelList
                dataKey="Withdrawn"
                position="top"
                fill="#FFF"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentBarChart;
