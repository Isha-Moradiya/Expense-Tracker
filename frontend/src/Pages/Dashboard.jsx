import ExpensePieChart from "../components/ExpenseCategoryChart";
import IncomeExpenseTotalChart from "../components/ExpenseIncomeChart";
import IncomePieChart from "../components/IncomeSourceChart";
import Slider from "../components/Slider";

const Dashboard = () => {
  return (
    <>
      <Slider />
      <IncomeExpenseTotalChart />
      <div className="flex m-6 gap-8">
        <ExpensePieChart />
        <IncomePieChart />
      </div>
    </>
  );
  a;
};

export default Dashboard;
