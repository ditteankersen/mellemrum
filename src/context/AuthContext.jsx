import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  function login(email, password) {
    if (email === "admin@mellemrum.dk" && password === "mellemrum") {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      return true;
    }

    return false;
  }

  function logout() {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 
