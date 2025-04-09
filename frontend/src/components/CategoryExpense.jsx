import React, { useEffect, useState, useMemo } from "react";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { TrendingDown } from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#14B8A6",
  "#E879F9",
  "#F43F5E",
  "#A855F7",
  "#F97316",
];

const ExpenseBreakdownChart = () => {
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
          headers: { Authorization: authorizationToken },
        }
      );

      let formattedData = res.data.map((item) => ({
        category: item?.category || "Unknown",
        totalAmount: item.totalAmount,
      }));

      if (formattedData.length === 0) {
        formattedData = [{ category: "No Data", totalAmount: 1 }];
      }

      setExpenseData(formattedData);
    } catch (error) {
      console.error("Failed to fetch expense breakdown", error);
      setExpenseData([{ category: "Error", totalAmount: 1 }]);
    }
  };

  useEffect(() => {
    fetchExpenseBreakdown();
  }, [selectedDate]);

  const formattedMonth = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, [selectedDate]);

  return (
    <Card className="my-4 sm:my-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-lg sm:text-2xl font-semibold text-gray-900 tracking-tight">
            Expense Breakdown
          </CardTitle>
          <CardDescription className="text-gray-600">
            {formattedMonth}
          </CardDescription>
        </div>

        <input
          type="month"
          value={formattedMonth}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="w-full sm:w-fit px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 font-medium transition duration-200"
        />
      </CardHeader>

      <CardContent className="w-full pt-4">
        <div className="flex flex-col items-center justify-center w-full h-[300px] sm:h-[380px] md:h-[460px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="totalAmount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="75%"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  const category = expenseData[index]?.category;
                  const displayLabel =
                    category === "No Data" || category === "Error"
                      ? ""
                      : `${category} ${(percent * 100).toFixed(0)}%`;

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#ffffff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={600}
                      className="drop-shadow"
                    >
                      {displayLabel}
                    </text>
                  );
                }}
                labelLine={false}
                isAnimationActive
              >
                {expenseData.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      item.category === "No Data" || item.category === "Error"
                        ? "#E5E7EB"
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "10px",
                  border: "1px solid #e5e7eb",
                }}
                labelStyle={{ fontWeight: "600", color: "#374151" }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                iconSize={window.innerWidth < 640 ? 8 : 12}
                wrapperStyle={{
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  rowGap: window.innerWidth < 640 ? "6px" : "8px",
                  gap: window.innerWidth < 640 ? "8px" : "12px",
                  fontSize: window.innerWidth < 640 ? "0.7rem" : "0.85rem",
                  color: "#4B5563",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          Trending down this month <TrendingDown className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Category-wise expense distribution
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpenseBreakdownChart;
