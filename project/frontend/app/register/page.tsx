"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== password2) {
      setError("Şifreler eşleşmiyor!");
      return;
    }
    setLoading(true);
    const err = await register(name, email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      toast({
        title: "Başarıyla kayıt olundu!",
        description: "Giriş ekranına yönlendiriliyorsunuz.",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 hover:text-indigo-600"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre Tekrar</label>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <span className="animate-spin mr-2">🔄</span> : null}
            Kayıt Ol
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Zaten hesabınız var mı? <a href="/login" className="text-indigo-600 hover:underline">Giriş Yap</a>
        </div>
      </div>
    </div>
  );
} 