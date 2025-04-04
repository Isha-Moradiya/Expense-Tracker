import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./Store/auth";
import ProtectedRoute from "./Pages/ProtectedRoute";

// Public Pages
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/VerifyEmail";
import ResendEmail from "./Pages/ResendEmail";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";

// Private Pages
import Expense from "./Pages/Expense";
import Income from "./Pages/Income";
import Investment from "./Pages/Investment";
import LentMoney from "./Pages/LentMoney";
import BorrowMoney from "./Pages/BorrowMoney";
import Category from "./Pages/Category";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/testimonial" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/feature" element={<Home />} />
        <Route path="/faq" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-email" element={<ResendEmail />} />
        <Route path="/logout" element={<Logout />} />

        {/* Private Routes (Wrapped in ProtectedRoute) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/income" element={<Income />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/lent-money" element={<LentMoney />} />
          <Route path="/borrow-money" element={<BorrowMoney />} />
          <Route path="/category" element={<Category />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Catch-all Route for Logged-Out Users */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
