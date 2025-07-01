"use client"

import QuoteForm from "../quote-form"
import Sidebar from "../components/sidebar"
import QuoteHistory from "@/components/quote-history"
import { useApp } from "../contexts/AppContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProductExcelImport from "../components/ProductExcelImport"
import ProductList from "../components/product-list"

export default function Page() {
  const { activeSection } = useApp()
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // Ürün listesini yenilemek için ortak bir anahtar
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Yükleniyor...</div>
  }

  const renderContent = () => {
    switch (activeSection) {
      case "create":
        return <QuoteForm />
      case "history":
        return <QuoteHistory />
      case "templates":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Şablonlar</h1>
            <p className="text-gray-600">Şablon yönetimi yakında eklenecek...</p>
          </div>
        )
      case "customers":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Müşteriler</h1>
            <p className="text-gray-600">Müşteri yönetimi yakında eklenecek...</p>
          </div>
        )
      case "products":
        return (
          <div className="p-0">
              <ProductList refreshKey={refreshKey} />
          </div>
        )
      case "analytics":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Analitik</h1>
            <p className="text-gray-600">Analitik raporları yakında eklenecek...</p>
          </div>
        )
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Ayarlar</h1>
            <p className="text-gray-600">Sistem ayarları yakında eklenecek...</p>
          </div>
        )
      default:
        return <QuoteForm />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Ana İçerik */}
      <div className="flex-1 overflow-hidden lg:ml-0">
        {renderContent()}
      </div>
    </div>
  )
}
