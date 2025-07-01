"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"

export default function QuoteHistory() {
  const { recentQuotes, loadQuoteData, deleteQuote, setSelectedQuoteId, setActiveSection } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)

  // Filtreleme ve sıralama
  const filteredQuotes = recentQuotes
    .filter(quote => {
      const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quote.data?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quote.data?.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "customer":
          comparison = (a.data?.customerName || "").localeCompare(b.data?.customerName || "")
          break
        case "total":
          const totalA = a.data?.products?.reduce((sum: number, product: any) => sum + (product.quantity * product.unitPrice * (1 + product.taxRate / 100)), 0) || 0
          const totalB = b.data?.products?.reduce((sum: number, product: any) => sum + (product.quantity * product.unitPrice * (1 + product.taxRate / 100)), 0) || 0
          comparison = totalA - totalB
          break
      }
      
      return sortOrder === "desc" ? -comparison : comparison
    })

  const handleQuoteClick = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setActiveSection("create");
  }

  const handleDeleteQuote = (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Bu teklifi silmek istediğinizden emin misiniz?")) {
      deleteQuote(quoteId)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Oluşturuldu": return "bg-blue-100 text-blue-700"
      case "Kaydedildi": return "bg-green-100 text-green-700"
      case "Onaylandı": return "bg-green-100 text-green-700"
      case "Beklemede": return "bg-yellow-100 text-yellow-700"
      case "İptal": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const calculateTotal = (products: any[]) => {
    return products?.reduce((sum, product) => {
      const subtotal = product.quantity * product.unitPrice
      const tax = subtotal * (product.taxRate / 100)
      return sum + subtotal + tax
    }, 0) || 0
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teklif Geçmişi</h1>
            <p className="text-gray-600">Geçmişteki tüm tekliflerinizi görüntüleyin ve yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Toplu İndir
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Teklif ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Oluşturuldu">Oluşturuldu</option>
            <option value="Kaydedildi">Kaydedildi</option>
            <option value="Onaylandı">Onaylandı</option>
            <option value="Beklemede">Beklemede</option>
            <option value="İptal">İptal</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Tarih</option>
            <option value="title">Başlık</option>
            <option value="customer">Müşteri</option>
            <option value="total">Toplam</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2"
          >
            {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {sortOrder === "desc" ? "Azalan" : "Artan"}
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredQuotes.length}</div>
            <div className="text-sm text-gray-600">Toplam Teklif</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredQuotes.filter(q => q.status === "Onaylandı").length}
            </div>
            <div className="text-sm text-gray-600">Onaylanan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredQuotes.filter(q => q.status === "Beklemede").length}
            </div>
            <div className="text-sm text-gray-600">Bekleyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              ₺{filteredQuotes.reduce((sum, q) => sum + calculateTotal(q.data?.products || []), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Toplam Değer</div>
          </div>
        </div>
      </div>

      {/* Teklif Listesi */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Teklif bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun teklif bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{quote.title}</h3>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{quote.data?.customerName || "Müşteri belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(quote.lastModified).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>₺{calculateTotal(quote.data?.products || []).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Detaylar (Genişletilebilir) */}
                      {expandedQuote === quote.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Müşteri Bilgileri:</strong>
                              <div className="mt-1 text-gray-600">
                                <div>Ad: {quote.data?.customerName || "-"}</div>
                                <div>E-posta: {quote.data?.companyEmail || "-"}</div>
                              </div>
                            </div>
                            <div>
                              <strong>Şirket Bilgileri:</strong>
                              <div className="mt-1 text-gray-600">
                                <div>Ad: {quote.data?.companyName || "-"}</div>
                                <div>Telefon: {quote.data?.companyPhone || "-"}</div>
                                <div>Adres: {quote.data?.companyAddress || "-"}</div>
                              </div>
                            </div>
                          </div>
                          
                          {quote.data?.products && quote.data.products.length > 0 && (
                            <div className="mt-4">
                              <strong>Ürünler ({quote.data.products.length} adet):</strong>
                              <div className="mt-2 space-y-1">
                                {quote.data.products.slice(0, 3).map((product: any, index: number) => (
                                  <div key={index} className="text-sm text-gray-600">
                                    • {product.name} - {product.quantity} adet
                                  </div>
                                ))}
                                {quote.data.products.length > 3 && (
                                  <div className="text-sm text-gray-500">
                                    ... ve {quote.data.products.length - 3} ürün daha
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                      >
                        {expandedQuote === quote.id ? "Gizle" : "Detaylar"}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuoteClick(quote.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteQuote(quote.id, e)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 