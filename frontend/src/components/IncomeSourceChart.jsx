import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../Store/auth";

const COLORS = [
  "#4BC0C0",
  "#FFCE56",
  "#FF6384",
  "#36A2EB",
  "#9966FF",
  "#FF9F40",
  "#A1C181",
  "#E76F51",
  "#6A0572",
  "#008080",
  "#D3D3D3", // Gray color for "No Data"
];

const IncomePieChart = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { authorizationToken } = useAuth();

  const fetchIncomeBreakdown = async () => {
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/income/source-income?month=${month}&year=${year}`,
        { headers: { Authorization: authorizationToken } }
      );
      console.log("API Response:", res.data);

      let formattedData = res.data.map((item) => ({
        source: item?.source,
        iconImage: item?.iconImage, // Get iconImage from API
        totalAmount: item.totalAmount,
      }));

      // If no data, add a "No Data" placeholder
      if (formattedData.length === 0) {
        formattedData = [{ source: "No Data", totalAmount: 1 }];
      }

      setIncomeData(formattedData);
    } catch (error) {
      console.error("Failed to fetch income breakdown", error);
    }
  };

  useEffect(() => {
    fetchIncomeBreakdown();
  }, [selectedDate]);

  return (
    <div className="bg-white/60 shadow-xl rounded-3xl p-6 w-full max-w-4xl mx-auto transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Total Income</h2>

        {/* Month Selector */}
        <div className="relative">
          <input
            type="month"
            value={`${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, "0")}`}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/80 backdrop-blur-md text-gray-700 font-medium"
          />
        </div>
      </div>

      <div className="w-full flex justify-center mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={incomeData}
              dataKey="totalAmount"
              nameKey="source"
              cx="40%"
              cy="50%"
              outerRadius={120}
              innerRadius={60} // Creates donut effect
              label={({ name, percent }) =>
                name === "No Data"
                  ? ""
                  : `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine
              animationDuration={800}
              opacity={incomeData[0]?.source === "No Data" ? 0.5 : 1} // Make it semi-transparent if no data
            >
              {incomeData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    item.source === "No Data"
                      ? "#D3D3D3"
                      : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "8px",
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={12}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomePieChart;
