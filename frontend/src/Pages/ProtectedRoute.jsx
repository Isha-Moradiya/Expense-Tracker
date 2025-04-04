import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Store/auth";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <div className="h-screen w-screen flex flex-col">
      {/* Full-width Topbar */}
      <Topbar />

      {/* Main Content: Sidebar + Page Content */}
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar (Fixed Left) */}
        <Sidebar />

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
