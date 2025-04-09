import Slider from "../components/Slider";
import IncomeExpenseTotalChart from "../components/ExpenseIncomeChart";
import ExpenseBreakdownChart from "../components/CategoryExpense";
import IncomeBreakdownChart from "../components/SourceIncome";
import InvestmentBarChart from "../components/InvestmentChart";

const Dashboard = () => {
  return (
    <>
      <Slider />
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="w-full sm:w-1/2 lg:w-1/2">
          <IncomeExpenseTotalChart />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/2">
          <InvestmentBarChart />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        {/* These two components will be side-by-side on md and lg screens */}
        <div className="w-full sm:w-1/2 lg:w-1/2">
          <ExpenseBreakdownChart />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/2">
          <IncomeBreakdownChart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
