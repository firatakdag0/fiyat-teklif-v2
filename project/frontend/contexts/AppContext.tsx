"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

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
  products: Array<{
    id: string
    code: string
    name: string
    description: string
    unitPrice: number
    quantity: number
    unit: string
    taxRate: number
    discount: number
  }>
  taxRate: number
  discount: number
  dominantColor: string
  logoPreview: string | null
}

interface RecentQuote {
  id: string
  title: string
  date: string
  status: string
  data: QuoteData
  lastModified: string
}

interface AppContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  recentQuotes: RecentQuote[]
  addRecentQuote: (quote: RecentQuote) => void
  loadQuoteData: (id: string) => QuoteData | null
  updateQuoteData: (id: string, data: QuoteData) => void
  deleteQuote: (id: string) => void
  selectedQuoteId: string | null
  setSelectedQuoteId: (id: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("create")
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([])
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)

  // localStorage'dan teklifleri yükle
  useEffect(() => {
    const savedQuotes = localStorage.getItem('recentQuotes')
    if (savedQuotes) {
      try {
        const parsedQuotes: RecentQuote[] = JSON.parse(savedQuotes);
        // Veri modelini güncelle (eski verilerle uyumluluk için)
        const updatedQuotes = parsedQuotes.map(quote => {
          quote.data.products = quote.data.products.map(p => ({
            ...p,
            discount: p.discount || 0
          }));
          return quote;
        });
        setRecentQuotes(updatedQuotes);
      } catch (error) {
        console.error('Teklifler yüklenirken hata:', error)
      }
    }
  }, [])

  // Teklifleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('recentQuotes', JSON.stringify(recentQuotes))
  }, [recentQuotes])

  const addRecentQuote = (quote: RecentQuote) => {
    setRecentQuotes(prev => {
      // Aynı ID'ye sahip teklif varsa güncelle, yoksa yeni ekle
      const existingIndex = prev.findIndex(q => q.id === quote.id)
      if (existingIndex !== -1) {
        const updated = [...prev]
        updated[existingIndex] = quote
        return updated
      } else {
        return [quote, ...prev.slice(0, 9)] // En fazla 10 teklif tut
      }
    })
  }

  const loadQuoteData = (id: string): QuoteData | null => {
    const quote = recentQuotes.find(q => q.id === id)
    return quote ? quote.data : null
  }

  const updateQuoteData = (id: string, data: QuoteData) => {
    setRecentQuotes(prev => 
      prev.map(quote => 
        quote.id === id 
          ? { ...quote, data, lastModified: new Date().toISOString() }
          : quote
      )
    )
  }

  const deleteQuote = (id: string) => {
    setRecentQuotes(prev => prev.filter(quote => quote.id !== id))
  }

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      recentQuotes,
      addRecentQuote,
      loadQuoteData,
      updateQuoteData,
      deleteQuote,
      selectedQuoteId,
      setSelectedQuoteId
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 