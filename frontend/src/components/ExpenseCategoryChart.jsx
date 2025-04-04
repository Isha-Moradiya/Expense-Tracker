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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

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

const ExpensePieChart = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { authorizationToken } = useAuth();

  const fetchExpenseBreakdown = async () => {
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/expense/category-expense?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      let formattedData = res.data.map((item) => ({
        category: item?.category,
        totalAmount: item.totalAmount,
      }));

      if (formattedData.length === 0) {
        formattedData = [{ category: "No Data", totalAmount: 1 }];
      }

      setExpenseData(formattedData);
    } catch (error) {
      console.error("Failed to fetch expense breakdown", error);
    }
  };

  useEffect(() => {
    fetchExpenseBreakdown();
  }, [selectedDate]);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-3xl p-6 transition-all hover:shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        <CardTitle className="text-xl font-bold text-gray-900">
          Expense Statistics
        </CardTitle>

        {/* Month Picker */}
        <input
          type="month"
          value={`${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}`}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white/80 backdrop-blur-md text-gray-700 font-medium"
        />
      </CardHeader>

      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="totalAmount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={({ name, percent }) =>
                  name === "No Data"
                    ? ""
                    : `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine
                animationDuration={800}
                opacity={expenseData[0]?.category === "No Data" ? 0.5 : 1}
              >
                {expenseData.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      item.category === "No Data"
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
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
