import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/auth";

const Logout = () => {
  const { LogoutUser } = useAuth();
  useEffect(() => {
    LogoutUser();
  }, [LogoutUser]);

  return <Navigate to="/" />;
};
export default Logout;
