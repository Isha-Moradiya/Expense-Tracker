import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  // Define a function to return the correct breadcrumb trail
  const getBreadcrumbs = () => {
    let breadcrumbTrail = [];

    if (location.pathname === "/") {
      breadcrumbTrail = [{ name: "Home", path: "/" }];
    } else if (location.pathname.startsWith("/dashboard")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
      ];
    } else if (location.pathname.startsWith("/expense")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Expense", path: "/expense" },
      ];
    } else if (location.pathname.startsWith("/income")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Income", path: "/income" },
      ];
    } else if (location.pathname.startsWith("/investment")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Investment", path: "/investment" },
      ];
    } else if (location.pathname.startsWith("/lent-money")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Lent", path: "/lent-money" },
      ];
    } else if (location.pathname.startsWith("/borrow-money")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Borrow", path: "/borrow-money" },
      ];
    } else if (location.pathname.startsWith("/category")) {
      breadcrumbTrail = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Category", path: "/category" },
      ];
    }

    return breadcrumbTrail;
  };

  const currentBreadcrumbItems = getBreadcrumbs();

  return (
    <nav className="text-sm text-gray-500 mb-6 flex items-center space-x-2 sm:space-x-2 md:space-x-2.5 lg:space-x-3 xl:space-x-3.5 flex-wrap">
      {currentBreadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <Link
            to={item.path}
            className={`${
              location.pathname === item.path
                ? "text-cyan-900 font-semibold"
                : "hover:text-cyan-900"
            }`}
          >
            {item.name}
          </Link>
          {index < currentBreadcrumbItems.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
