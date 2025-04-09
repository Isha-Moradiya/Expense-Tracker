import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Store/auth";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen w-screen overflow-hidden relative ">
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 z-50 shadow-md bg-black transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar isMobile={isMobile} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-gray-100/40 backdrop-blur-sm transition-opacity"
        ></div>
      )}

      {/* Topbar */}
      <div
        className="fixed top-0 z-30 transition-all duration-300"
        style={{
          left: !isMobile && isSidebarOpen ? "256px" : 0,
          width: !isMobile && isSidebarOpen ? "calc(100% - 256px)" : "100%",
          height: "64px",
        }}
      >
        <Topbar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div
        className="absolute pt-20 px-5 pb-5 overflow-y-auto transition-all duration-300"
        style={{
          left: !isMobile && isSidebarOpen ? "256px" : 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="container mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
