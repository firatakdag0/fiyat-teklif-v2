"use client"

import { useState } from "react"
import { 
  FileText, 
  Plus, 
  History, 
  Settings, 
  Users, 
  Package, 
  BarChart3, 
  Download,
  Upload,
  Palette,
  Building2,
  Calendar,
  DollarSign,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/AppContext"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const { activeSection, setActiveSection, recentQuotes, loadQuoteData, setSelectedQuoteId } = useApp()
  const { user, logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      id: "create",
      label: "Teklif Oluştur",
      icon: Plus,
      description: "Yeni teklif hazırla"
    },
    {
      id: "history",
      label: "Teklif Geçmişi",
      icon: History,
      description: "Önceki teklifler"
    },
    {
      id: "products",
      label: "Ürün Kataloğu",
      icon: Package,
      description: "Ürün yönetimi"
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
      description: "Sistem ayarları"
    }
  ]

  const handleQuoteClick = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setActiveSection("create");
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* Mobil Menü Butonu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-80 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EasyTradeTR</h1>
              <p className="text-sm text-gray-500">Teklif Sistemi</p>
            </div>
          </div>
          
          {/* Hızlı İstatistikler */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-600">Bu Ay</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">₺125K</div>
              <div className="text-xs text-gray-600">Toplam</div>
            </div>
          </div>
        </div>

        {/* Ana Menü */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Ana Menü</h3>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsMobileOpen(false) // Mobilde menüyü kapat
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Son Teklifler */}
        <div className="p-4 border-t border-gray-200 flex flex-col flex-1 min-h-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 shrink-0">Son Teklifler</h3>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {recentQuotes.length === 0 ? (
              <div className="text-center py-4 text-gray-500 flex flex-col items-center justify-center h-full">
                <FileText className="w-8 h-8 mb-2 text-gray-300" />
                <div className="text-xs">Henüz teklif yok</div>
                <div className="text-xs">İlk teklifinizi oluşturun</div>
              </div>
            ) : (
              recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                  onClick={() => handleQuoteClick(quote.id)}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">{quote.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{quote.data?.customerName || 'Müşteri belirtilmemiş'}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(quote.lastModified).toLocaleDateString('tr-TR')}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      quote.status === "Oluşturuldu" ? "bg-blue-100 text-blue-700" :
                      quote.status === "Kaydedildi" ? "bg-green-100 text-green-700" :
                      quote.status === "Onaylandı" ? "bg-green-100 text-green-700" :
                      quote.status === "Beklemede" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profil Kutusu - Sol Alt */}
        {user && (
          <div className="mb-4 mx-4 p-3 bg-indigo-50 rounded-lg flex flex-col items-center shadow">
            <div className="font-semibold text-indigo-700">{user.name}</div>
            <div className="text-xs text-gray-500 mb-2">{user.email}</div>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        )}

        {/* Alt Bilgi */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <div className="mb-1">EasyTradeTR v2.0</div>
            <div>© 2024 Tüm hakları saklıdır</div>
          </div>
        </div>
      </div>

      {/* Mobil Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
} 