"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light-mode");
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light-mode";
    setTheme(savedTheme);
  }, []);
  useEffect(() => {
    document.body.classList.add("login-page");
    if (theme === "dark-mode") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    return () => {
      document.body.classList.remove("login-page");
      document.body.classList.remove("dark");
    };
  }, []);
  useEffect(() => {
    if (theme === "dark-mode") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark-mode" : "light-mode");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="theme-switch-wrapper">
        <label className="theme-switch" htmlFor="checkbox">
          <input
            type="checkbox"
            id="checkbox"
            onChange={handleThemeChange}
            checked={theme === "dark-mode"}
          />
          <div className="slider round"></div>
        </label>
      </div>
      <div className="container">
        <div className="form-wrapper">
          <div className="form-header">
            <img src="/logo.png" alt="EasyTrade Logo" className="header-logo" />
            <span className="header-title">EasyTrade</span>
          </div>
          <p className="subtitle">Hesabınıza giriş yapmak için bilgilerinizi girin.</p>
          <form onSubmit={handleSubmit} id="loginForm">
            <div className="form-group">
              <label htmlFor="email">E-posta Adresi:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Şifre:</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  style={{ position: "absolute", right: 8, top: 8, background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="form-options">
              <label className="remember-me" htmlFor="remember">
                <input type="checkbox" name="remember" id="remember" />
                Beni Hatırla
              </label>
              <div className="forgot-password">
                <a href="/register">Kayıt Ol</a>
              </div>
            </div>
            {error && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: 10 }}>{error}</div>}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <span className="animate-spin mr-2">🔄</span> : null}
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 