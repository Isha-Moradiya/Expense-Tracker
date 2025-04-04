import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const authorizationToken = token ? `Bearer ${token}` : "";

  const storeTokenInLocalStorage = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5006/api/auth/user", {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      // console.log(response);

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        LogoutUser();
      }
    } catch (error) {
      console.log("Error fetching user data");
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        storeTokenInLocalStorage,
        LogoutUser,
        isLoggedIn,
        authorizationToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
