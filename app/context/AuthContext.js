"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 1. Shared "box" jisme user data rakha jayega
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // taaki header flicker na ho

  // App load hote hi ek baar localStorage check karo (root level pe)
  useEffect(() => {
    const storedUser = localStorage.getItem("rpetalsUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("rpetalsUser");
      }
    }
    setLoading(false);
  }, []);

  // Login hone par ye function call hoga (Login page se)
  const login = (userData) => {
    localStorage.setItem("rpetalsUser", JSON.stringify(userData));
    setUser(userData); // <-- isi line se Header turant re-render hota hai
  };

  // Logout hone par ye function call hoga (Header se)
  const logout = () => {
    localStorage.removeItem("rpetalsUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Har component mein easily use karne ke liye custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
