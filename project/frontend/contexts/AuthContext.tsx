"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setUser(data || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.errors && data.errors.email && data.errors.email[0] === "The provided credentials are incorrect.") {
          return "Kullanıcı adı veya şifrenizi kontrol ediniz.";
        }
        return data.message || "Giriş başarısız";
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setUser(data.user);
      return null;
    } catch (e) {
      return "Sunucu hatası";
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return data.message || "Kayıt başarısız";
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setUser(data.user);
      return null;
    } catch (e) {
      return "Sunucu hatası";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 