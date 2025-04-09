import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Store/auth";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function IncomeBreakdownChart() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const fetchIncomeBreakdown = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/income/source-income?month=${selectedMonth}&year=${selectedYear}`,
          { headers: { Authorization: authorizationToken } }
        );
        const formatted = res.data.map((item) => ({
          source: item.source,
          income: item.totalAmount,
        }));
        setData(formatted);
      } catch (err) {
        console.error("Income fetch failed:", err);
      }
    };

    fetchIncomeBreakdown();
  }, [selectedMonth, selectedYear]);

  return (
    <Card className="my-4 sm:my-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-lg sm:text-2xl font-semibold text-gray-900 tracking-tight">
            Income Breakdown
          </CardTitle>
          <CardDescription className="text-gray-600">
            {months[selectedMonth - 1]} {selectedYear}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 font-medium transition duration-200"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 font-medium transition duration-200"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </CardHeader>

      <CardContent className="w-full pt-4">
        <div className="flex flex-col items-center justify-center w-full h-[250px] sm:h-[380px] md:h-[460px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="source"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip />
              <Bar dataKey="income" fill="#4f46e5" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="income"
                  position="top"
                  fontSize={12}
                  className="fill-foreground"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Source-wise income distribution
        </div>
      </CardFooter>
    </Card>
  );
}
