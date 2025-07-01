"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Product {
  id: string
  code: string
  name: string
  description: string
  unitPrice: number
  quantity: number
  unit: string
}

interface QuoteData {
  quoteNo: string
  preparedBy: string
  customerName: string
  quoteDate: string
  validUntil: string
  quoteTitle: string
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  products: Product[]
  taxRate: number
  discount: number
  dominantColor?: string
  logoPreview?: string
}

export default function PDFPreviewPage() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const PRODUCTS_PER_PAGE = 8 // Sayfa başına maksimum ürün sayısı

  const paginateProducts = (products: Product[]) => {
    const pages = []
    for (let i = 0; i < products.length; i += PRODUCTS_PER_PAGE) {
      pages.push(products.slice(i, i + PRODUCTS_PER_PAGE))
    }
    return pages
  }

  useEffect(() => {
    // localStorage'dan verileri al
    const savedData = localStorage.getItem("quoteData")
    if (savedData) {
      setQuoteData(JSON.parse(savedData))
    }
  }, [])

  if (!quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Teklif verisi bulunamadı
          </h1>
          <p className="text-gray-600 mb-6">Lütfen önce teklif oluştur sayfasından bir teklif hazırlayın.</p>
          <Button 
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = quoteData.products.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0)
  const taxAmount = (subtotal * quoteData.taxRate) / 100
  const grandTotal = subtotal + taxAmount - quoteData.discount

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Backend'e gönderilecek veriyi hazırla
      const dataToSend = {
        ...quoteData,
        dominantColor: quoteData.dominantColor || '#6b7280', // Varsayılan gri
        logoPreview: quoteData.logoPreview || null
      };

      // Laravel API'ye POST isteği gönder
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `teklif-${quoteData.quoteNo}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // PDF başarıyla indirildikten sonra localStorage'ı temizle
        localStorage.removeItem("quoteData")
        
        // Ana sayfaya yönlendir
        window.location.href = "/"
      } else {
        alert("PDF oluşturulurken bir hata oluştu.")
      }
    } catch (error) {
      console.error("PDF oluşturma hatası:", error)
      alert("PDF oluşturulurken bir hata oluştu.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const productPages = paginateProducts(quoteData.products)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => (window.location.href = "/")}
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                PDF Önizleme
              </h1>
              <p className="text-gray-600">Teklifinizi kontrol edin ve PDF olarak indirin</p>
            </div>
            <Button 
              onClick={generatePDF} 
              disabled={isGeneratingPDF} 
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
            >
              {isGeneratingPDF ? "PDF Oluşturuluyor..." : "PDF İndir"}
            </Button>
          </div>
        </div>

        {/* Teklif Bilgileri */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Teklif Bilgileri</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Teklif No:</span>
                <span className="font-bold text-blue-600">{quoteData.quoteNo}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Hazırlayan:</span>
                <span className="font-medium text-gray-900">{quoteData.preparedBy}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Müşteri/Firma:</span>
                <span className="font-medium text-gray-900">{quoteData.customerName}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Teklif Tarihi:</span>
                <span className="font-medium text-gray-900">{quoteData.quoteDate}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Geçerlilik Tarihi:</span>
                <span className="font-medium text-gray-900">{quoteData.validUntil}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Teklif Başlığı:</span>
                <span className="font-medium text-gray-900">{quoteData.quoteTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Şirket Bilgileri */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Şirket Bilgileri</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Şirket Adı:</span>
                <span className="font-medium text-gray-900">{quoteData.companyName}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Telefon:</span>
                <span className="font-medium text-gray-900">{quoteData.companyPhone}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">E-posta:</span>
                <span className="font-medium text-gray-900">{quoteData.companyEmail}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700 block mb-2">Adres:</span>
                <span className="font-medium text-gray-900">{quoteData.companyAddress}</span>
              </div>
              {quoteData.dominantColor && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-700">Teklif Şablonu Tema Rengi:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: quoteData.dominantColor }}
                      title={`Baskın renk: ${quoteData.dominantColor}`}
                    />
                    <span className="text-sm font-mono text-gray-600">{quoteData.dominantColor}</span>
                  </div>
                </div>
              )}
              {quoteData.logoPreview && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-700">Logo:</span>
                  <img 
                    src={quoteData.logoPreview} 
                    alt="Şirket logosu" 
                    className="max-h-10 max-w-32 object-contain border rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ürünler ve Hesaplama Özeti - Yan Yana */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Ürünler - 2/3 genişlik */}
          <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Seçilen Ürünler</h2>
              <span className="ml-auto bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {quoteData.products.length} ürün
              </span>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-xl">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-l-xl">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ürün Kodu</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ürün Adı</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Açıklama</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Birim Fiyat</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Miktar</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 rounded-r-xl">Ara Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quoteData.products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono bg-gray-50 rounded-lg px-2 py-1">{product.code}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                        {product.unitPrice != null ? product.unitPrice.toLocaleString("tr-TR") : "-"} ₺
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                          {product.quantity} {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">
                        {(product.quantity * product.unitPrice).toLocaleString("tr-TR")} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hesaplama Özeti - 1/3 genişlik */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hesaplama Özeti</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Ara Toplam:</span>
                <span className="font-bold text-gray-900">{subtotal.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <span className="font-semibold text-blue-700">KDV ({quoteData.taxRate}%):</span>
                <span className="font-bold text-blue-900">{taxAmount.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <span className="font-semibold text-orange-700">İndirim:</span>
                <span className="font-bold text-orange-900">-{quoteData.discount.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white shadow-lg border border-emerald-400/20">
                <div className="text-lg font-bold mb-2">Genel Toplam</div>
                <div className="text-2xl font-bold">{grandTotal.toLocaleString("tr-TR")} ₺</div>
              </div>
              
              {/* PDF İndirme Butonu */}
              <div className="pt-4">
                <Button 
                  onClick={generatePDF} 
                  disabled={isGeneratingPDF} 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-4 text-lg font-semibold rounded-xl group"
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>PDF Oluşturuluyor...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>PDF İndir</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
