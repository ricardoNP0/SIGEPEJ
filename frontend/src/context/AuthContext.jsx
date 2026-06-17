import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("sigepej_user");
    const storedToken = localStorage.getItem("sigepej_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("sigepej_token", newToken);
    localStorage.setItem("sigepej_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sigepej_token");
    localStorage.removeItem("sigepej_user");
  };

  // Maps roles for UI (e.g. "administrador" -> "admin")
  const getMappedRole = () => {
    if (!user) return null;
    if (user.role === "administrador") return "admin";
    return user.role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        activeRole: getMappedRole()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
