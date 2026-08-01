import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const saveSession = useCallback((data) => {
    const userInfo = {
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider value={{ user, token, saveSession, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
