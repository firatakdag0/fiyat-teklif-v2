"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Search, FileText, Upload, Palette, Package, Check, Building, Calculator, Receipt } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useApp } from "@/contexts/AppContext"
import { useToast } from "@/hooks/use-toast"
import ProductExcelImport from "../components/ProductExcelImport"

interface Product {
  id: string
  code: string
  name: string
  description: string
  unitPrice: number
  quantity: number
  unit: string
  taxRate: number
  discount: number
}

interface CatalogProduct {
  id: string
  code: string
  name: string
  description: string
  unitPrice: number
  unit: string
  category: string
  inStock: boolean
  taxRate: number
  discount: number
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
}

function getNextQuoteNo() {
  const year = new Date().getFullYear();
  const key = `lastQuoteNo-${year}`;
  let last = Number(typeof window !== "undefined" ? localStorage.getItem(key) : "0") || 0;
  last += 1;
  if (typeof window !== "undefined") localStorage.setItem(key, String(last));
  return `ETR-${year}-${String(last).padStart(3, "0")}`;
}

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);

// Renk analizi fonksiyonu
function analyzeDominantColor(imageElement: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '#6b7280'; // Fallback gri renk
  
  // Canvas boyutunu ayarla
  canvas.width = 100;
  canvas.height = 100;
  
  // Görseli canvas'a çiz
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  // Piksel verilerini al
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Renk sayacı
  const colorCount: { [key: string]: number } = {};
  
  // Her pikseli analiz et
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Şeffaf pikselleri atla
    if (a < 128) continue;
    
    // Çok açık veya çok koyu renkleri atla (muhtemelen arka plan)
    const brightness = (r + g + b) / 3;
    if (brightness < 30 || brightness > 225) continue;
    
    // Renk anahtarını oluştur (renk gruplarına ayır)
    const colorKey = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
    colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
  }
  
  // En çok kullanılan rengi bul
  let dominantColor = '#6b7280'; // Varsayılan gri
  let maxCount = 0;
  
  for (const [colorKey, count] of Object.entries(colorCount)) {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = colorKey.split(',').map(Number);
      dominantColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
  
  return dominantColor;
}

export default function QuoteForm() {
  const { addRecentQuote, loadQuoteData: loadQuoteDataFromContext, selectedQuoteId } = useApp()
  const { toast } = useToast()

  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNo: typeof window !== "undefined" ? getNextQuoteNo() : "ETR-0000-000",
    preparedBy: "Ahmet Yılmaz",
    customerName: "Teknoloji A.Ş.",
    quoteDate: todayStr,
    validUntil: todayStr,
    quoteTitle: "Teknoloji Ekipmanları Teklifi",
    companyName: "EasyTradeTR",
    companyAddress: "Maslak Mahallesi, Büyükdere Cad. No:255 Sarıyer/İstanbul",
    companyPhone: "+90 212 456 78 90",
    companyEmail: "info@easytradetr.com",
    taxRate: 20,
    discount: 0,
    products: [],
  })

  // Logo ve renk analizi state'leri
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<string>('#6b7280');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);

  // localStorage'dan veri yükleme
  useEffect(() => {
    const loadFromStorage = () => {
      const savedData = localStorage.getItem("quoteData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setQuoteData(prev => ({
            ...prev,
            ...parsedData,
            quoteNo: parsedData.quoteNo || prev.quoteNo,
            preparedBy: parsedData.preparedBy || prev.preparedBy,
            customerName: parsedData.customerName || prev.customerName,
            quoteDate: parsedData.quoteDate || prev.quoteDate,
            validUntil: parsedData.validUntil || prev.validUntil,
            quoteTitle: parsedData.quoteTitle || prev.quoteTitle,
            companyName: parsedData.companyName || prev.companyName,
            companyAddress: parsedData.companyAddress || prev.companyAddress,
            companyPhone: parsedData.companyPhone || prev.companyPhone,
            companyEmail: parsedData.companyEmail || prev.companyEmail,
            products: parsedData.products || prev.products,
            taxRate: parsedData.taxRate || prev.taxRate,
            discount: parsedData.discount || prev.discount,
          }));
          if (parsedData.logoPreview) {
            setLogoPreview(parsedData.logoPreview);
          }
          if (parsedData.dominantColor) {
            setDominantColor(parsedData.dominantColor);
          }
        } catch (error) {
          console.error("localStorage'dan veri yüklenirken hata:", error);
        }
      }
    };
    loadFromStorage();
    // Başka sekmeden veya uygulama içi localStorage değişikliğinde otomatik güncelle
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "quoteData") {
        loadFromStorage();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Veri değişikliklerini localStorage'a kaydet
  useEffect(() => {
    const dataToSave = {
      ...quoteData,
      dominantColor: dominantColor,
      logoPreview: logoPreview
    };
    localStorage.setItem("quoteData", JSON.stringify(dataToSave));
    
    // Otomatik kaydetme (her 30 saniyede bir)
    const autoSaveInterval = setInterval(() => {
      if (quoteData.products.length > 0) {
        saveQuoteData();
      }
    }, 30000); // 30 saniye

    return () => clearInterval(autoSaveInterval);
  }, [quoteData, dominantColor, logoPreview]);

  // Tüm verileri temizleme fonksiyonu
  const clearAllData = () => {
    // State'leri sıfırla
    setQuoteData({
      quoteNo: getNextQuoteNo(),
      preparedBy: "Ahmet Yılmaz",
      customerName: "Teknoloji A.Ş.",
      quoteDate: todayStr,
      validUntil: todayStr,
      quoteTitle: "Teknoloji Ekipmanları Teklifi",
      companyName: "EasyTradeTR",
      companyAddress: "Maslak Mahallesi, Büyükdere Cad. No:255 Sarıyer/İstanbul",
      companyPhone: "+90 212 456 78 90",
      companyEmail: "info@easytradetr.com",
      taxRate: 20,
      discount: 0,
      products: [],
    });
    
    // Logo ve renk bilgilerini sıfırla
    setLogoFile(null);
    setLogoPreview(null);
    setDominantColor('#6b7280');
    
    // localStorage'ı temizle
    localStorage.removeItem("quoteData");
    
    // Başarı bildirimi
    toast({
      variant: "success",
      title: "Form temizlendi",
      description: "Tüm veriler başarıyla sıfırlandı.",
    });
  };

  // Önceden tanımlanmış renk paleti
  const colorPalette = [
    '#6b7280', // Gri (varsayılan)
    '#3b82f6', // Mavi
    '#10b981', // Yeşil
    '#f59e0b', // Turuncu
    '#ef4444', // Kırmızı
    '#8b5cf6', // Mor
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#f43f5e', // Rose
    '#a855f7', // Violet
    '#0ea5e9', // Sky
    '#22c55e', // Emerald
  ];

  // Logo yükleme fonksiyonu
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        // Logo yüklendiğinde otomatik renk analizi yapma, kullanıcı manuel olarak başlatsın
      };
      reader.readAsDataURL(file);
    }
  };

  // Logo rengini analiz et
  const analyzeLogoColor = () => {
    if (!logoRef.current) return;
    
    setIsAnalyzing(true);
    try {
      const color = analyzeDominantColor(logoRef.current);
      console.log('Analiz edilen baskın renk:', color);
      
      // Direkt olarak rengi tema rengi olarak ayarla
      setDominantColor(color);
      
      // Başarı bildirimi göster
      toast({
        variant: "success",
        title: "Logo rengi uygulandı",
        description: (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Logo rengi tema rengi olarak ayarlandı.</span>
          </div>
        ),
      });
    } catch (error) {
      console.error('Renk analizi hatası:', error);
      toast({
        variant: "destructive",
        title: "Renk analizi hatası",
        description: "Logo rengi analiz edilemedi. Lütfen manuel olarak renk seçin.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manuel renk analizi butonu için
  const handleManualColorAnalysis = () => {
    if (logoRef.current) {
      analyzeLogoColor();
    }
  };

  // Renk paletinden renk seçimi
  const handleColorSelect = (color: string) => {
    setDominantColor(color);
    setShowColorPalette(false);
  };

  // Özel renk seçimi
  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDominantColor(event.target.value);
  };

  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);

  const fetchCatalogProducts = useCallback(() => {
    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((p: any) => ({
          id: p.id.toString(),
          code: p.product_code,
          name: p.product_name,
          description: p.description || "",
          unitPrice: p.unit_price,
          unit: p.unit,
          category: "",
          inStock: true,
          taxRate: p.vat_rate,
          discount: 0,
        }));
        setCatalogProducts(mapped);
      });
  }, []);

  useEffect(() => {
    fetchCatalogProducts();
  }, [fetchCatalogProducts]);

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const defaultTitles = [
    "Teknoloji Ekipmanları Teklifi",
    "Yazılım Lisans Teklifi",
    "Donanım Satış Teklifi",
    "Bakım & Destek Teklifi",
    "Özel Proje Teklifi"
  ];
  const [titleOptions, setTitleOptions] = useState<string[]>(defaultTitles);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subtotal = quoteData.products.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0)
  const totalProductDiscount = quoteData.products.reduce((sum, product) => sum + (product.discount || 0), 0)
  const taxAmount = quoteData.products.reduce((sum, product) => {
    const itemTotal = product.unitPrice * product.quantity - (product.discount || 0);
    return sum + (itemTotal * product.taxRate / 100);
  }, 0)
  const grandTotal = subtotal - totalProductDiscount + taxAmount - quoteData.discount

  const addProductFromCatalog = async (catalogProduct: CatalogProduct) => {
    // Aynı ürün kodu zaten var mı kontrol et
    const existingProductIndex = quoteData.products.findIndex(
      product => product.code === catalogProduct.code
    );

    if (existingProductIndex !== -1) {
      // Aynı ürün zaten varsa, miktarını artır
      setQuoteData((prev) => ({
        ...prev,
        products: prev.products.map((product, index) =>
          index === existingProductIndex
            ? { ...product, quantity: product.quantity + 1 }
            : product
        ),
      }));

      // Miktar artırma bildirimi göster
      toast({
        variant: "success",
        title: "Miktar artırıldı",
        description: (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">{catalogProduct.name} miktarı 1 artırıldı.</span>
          </div>
        ),
      });
    } else {
      // Yeni ürün ekle
    const newProduct: Product = {
      id: Date.now().toString(),
      code: catalogProduct.code,
      name: catalogProduct.name,
      description: catalogProduct.description,
      unitPrice: catalogProduct.unitPrice,
      quantity: 1,
      unit: catalogProduct.unit,
      taxRate: catalogProduct.taxRate,
      discount: 0,
      };
      
    setQuoteData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
      }));
      
      // Yeni ürün ekleme bildirimi göster
      toast({
        variant: "success",
        title: "Ürün eklendi",
        description: (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">{catalogProduct.name} başarıyla teklife eklendi.</span>
          </div>
        ),
      });

      // Ürün ekleme işlemi
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          taxRate: Number(newProduct.taxRate)
        })
      });

      if (!res.ok) {
        console.error("Ürün eklenirken hata:", res.statusText);
        toast({
          variant: "destructive",
          title: "Ürün eklenirken hata",
          description: "Ürün eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        });
      }
    }
  }

  const removeProduct = (id: string) => {
    const productToRemove = quoteData.products.find(p => p.id === id);
    setQuoteData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
    
    // Ürün kaldırma bildirimi göster
    if (productToRemove) {
      toast({
        variant: "destructive",
        title: "Ürün kaldırıldı",
        description: (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-gray-700">{productToRemove.name} tekliften kaldırıldı.</span>
          </div>
        ),
      })
    }
  }

  const updateQuoteData = (field: keyof QuoteData, value: string | number) => {
    setQuoteData((prev) => ({ ...prev, [field]: value }))
  }

  const updateProductQuantity = (id: string, quantity: number) => {
    setQuoteData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, quantity } : p)),
    }))
  }

  const updateProductTaxRate = (id: string, taxRate: number) => {
    setQuoteData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, taxRate } : p)),
    }))
  }

  const updateProductDiscount = (id: string, discount: number) => {
    setQuoteData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, discount } : p)),
    }))
  }

  const generatePDF = () => {
    // Verileri localStorage'a kaydet (dominant rengi de dahil et)
    const dataToSave = {
      ...quoteData,
      dominantColor: dominantColor,
      logoPreview: logoPreview
    };
    localStorage.setItem("quoteData", JSON.stringify(dataToSave))

    // Son teklifler listesine ekle
    addRecentQuote({
      id: quoteData.quoteNo,
      title: quoteData.quoteTitle,
      date: quoteData.quoteDate,
      status: "Oluşturuldu",
      data: dataToSave,
      lastModified: new Date().toISOString()
    });

    // PDF sayfasına yönlendir
    window.location.href = "/pdf-preview"
  }

  // Teklif verilerini kaydet (otomatik kaydetme)
  const saveQuoteData = () => {
    const dataToSave = {
      ...quoteData,
      dominantColor: dominantColor,
      logoPreview: logoPreview
    };
    
    // localStorage'a kaydet
    localStorage.setItem("quoteData", JSON.stringify(dataToSave))
    
    // Son teklifler listesine ekle/güncelle
    addRecentQuote({
      id: quoteData.quoteNo,
      title: quoteData.quoteTitle,
      date: quoteData.quoteDate,
      status: "Kaydedildi",
      data: dataToSave,
      lastModified: new Date().toISOString()
    });
  }

  // Teklif verilerini geri yükle
  const restoreQuoteData = async (id: string) => {
    const savedData = await loadQuoteDataFromContext(id);
    if (savedData) {
      setQuoteData({
        ...savedData,
        quoteNo: getNextQuoteNo(),
      });
      setDominantColor(savedData.dominantColor || '#6b7280');
      setLogoPreview(savedData.logoPreview || null);
      toast({
        variant: "success",
        title: "Teklif yüklendi",
        description: `${savedData.quoteTitle} teklifi başarıyla yüklendi.`,
      });
    }
  }

  const filteredProducts = catalogProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const removeTitle = (title: string) => {
    setTitleOptions((prev) => prev.filter((t) => t !== title));
    if (quoteData.quoteTitle === title) {
      updateQuoteData("quoteTitle", "");
    }
  };

  // Kapanma için dışarı tıklama
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTitleDropdown(false);
      }
      
      // Renk paleti için dışarı tıklama kontrolü
      const colorPaletteElement = document.querySelector('[data-color-palette]');
      if (showColorPalette && colorPaletteElement && !colorPaletteElement.contains(event.target as Node)) {
        setShowColorPalette(false);
      }
    }
    if (showTitleDropdown || showColorPalette) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTitleDropdown, showColorPalette]);

  async function fetchOfferDetail(id, token) {
    const res = await fetch(`http://localhost:8000/api/offers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }

  // Teklif seçildiğinde:
  const handleSelectOffer = async (id) => {
    const offer = await fetchOfferDetail(id, token);
    setQuoteData({
      quoteNo: offer.quote_no,
      preparedBy: offer.prepared_by,
      customerName: offer.customer_name,
      quoteDate: offer.quote_date,
      validUntil: offer.valid_until,
      quoteTitle: offer.quote_title,
      companyName: offer.company_name,
      companyAddress: offer.company_address,
      companyPhone: offer.company_phone,
      companyEmail: offer.company_email,
      taxRate: offer.vat,
      discount: offer.discount,
      products: offer.items.map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        unit: item.unit,
        taxRate: item.vat_rate,
        discount: item.discount,
      })),
    });
  };

  // Seçili teklif id'si değişirse formu doldur
  useEffect(() => {
    if (selectedQuoteId) {
      const data = loadQuoteDataFromContext(selectedQuoteId);
      if (data) {
        setQuoteData({ ...data, quoteNo: getNextQuoteNo() });
        if (data.logoPreview) setLogoPreview(data.logoPreview);
        if (data.dominantColor) setDominantColor(data.dominantColor);
      }
    }
  }, [selectedQuoteId]);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 pt-20 lg:pt-8">
        {/* Modern Başlık Bölümü */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
            Teklif Oluştur
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Müşterileriniz için profesyonel ve etkileyici fiyat teklifleri hazırlayın
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Hızlı ve Kolay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Profesyonel Tasarım</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>PDF Çıktı</span>
            </div>
          </div>
      </div>

        {/* Hızlı İşlemler */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={generatePDF}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              PDF Önizleme
            </Button>
            <Button
              onClick={saveQuoteData}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 px-6 py-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
            <span className="text-sm text-gray-500">
              {quoteData.products.length} ürün seçildi
            </span>
          </div>
          <Button
            onClick={clearAllData}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Tümünü Temizle
          </Button>
        </div>

        {/* Teklif ve Şirket Bilgileri - Yan Yana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Taraf - Teklif Bilgileri */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Teklif Bilgileri
              </CardTitle>
        </CardHeader>
            <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quoteNo">Teklif No</Label>
              <Input
                id="quoteNo"
                value={quoteData.quoteNo}
                onChange={(e) => updateQuoteData("quoteNo", e.target.value)}
                    readOnly
                    className="bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="preparedBy">Hazırlayan</Label>
              <Input
                id="preparedBy"
                value={quoteData.preparedBy}
                onChange={(e) => updateQuoteData("preparedBy", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerName">Müşteri/Firma Adı</Label>
            <Input
              id="customerName"
              value={quoteData.customerName}
              onChange={(e) => updateQuoteData("customerName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quoteDate">Teklif Tarihi</Label>
              <Input
                id="quoteDate"
                    type="date"
                value={quoteData.quoteDate}
                onChange={(e) => updateQuoteData("quoteDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Geçerlilik Tarihi</Label>
              <Input
                id="validUntil"
                    type="date"
                value={quoteData.validUntil}
                onChange={(e) => updateQuoteData("validUntil", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quoteTitle">Teklif Başlığı</Label>
                <div className="flex gap-2 items-center relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="w-full border rounded px-2 py-1 text-left bg-white"
                    style={{ minHeight: 36 }}
                    onClick={() => setShowTitleDropdown((v) => !v)}
                  >
                    {quoteData.quoteTitle || "Başlık seçin..."}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTitleInput(true)}
                    style={{ fontSize: 20, fontWeight: "bold", width: 32, height: 32, borderRadius: 16, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Yeni başlık ekle"
                  >
                    +
                  </button>
                  {showTitleDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-full z-50 bg-white border rounded shadow" style={{ minWidth: 250 }}>
                      {titleOptions.length === 0 && (
                        <div className="p-2 text-gray-400 text-sm">Başlık yok</div>
                      )}
                      {titleOptions.map((opt) => (
                        <div key={opt} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer">
                          <span
                            className={"flex-1 " + (quoteData.quoteTitle === opt ? "font-bold text-blue-700" : "")}
                            onClick={() => { updateQuoteData("quoteTitle", opt); setShowTitleDropdown(false); }}
                          >
                            {opt}
                          </span>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); removeTitle(opt); }}
                            className="ml-2 text-red-500 text-lg font-bold hover:text-red-700"
                            title="Başlığı sil"
                            style={{ width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", border: "none" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {showTitleInput && (
                  <div className="flex gap-2 mt-2">
            <Input
                      autoFocus
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Yeni başlık girin"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newTitle && !titleOptions.includes(newTitle)) {
                          setTitleOptions([newTitle, ...titleOptions]);
                          updateQuoteData("quoteTitle", newTitle);
                        }
                        setShowTitleInput(false);
                        setNewTitle("");
                      }}
                    >Ekle</Button>
                    <Button type="button" variant="outline" onClick={() => { setShowTitleInput(false); setNewTitle(""); }}>İptal</Button>
                  </div>
                )}
          </div>
        </CardContent>
      </Card>

          {/* Sağ Taraf - Şirket Bilgileri */}
          <div className="relative z-10">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-3 text-green-900">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  Teklifi Yapan Şirket Bilgileri
                </CardTitle>
          </CardHeader>
              <CardContent className="space-y-6 p-6">
            <div>
              <Label htmlFor="companyName">Şirket Adı</Label>
              <Input
                id="companyName"
                value={quoteData.companyName}
                onChange={(e) => updateQuoteData("companyName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="companyAddress">Adres</Label>
              <Textarea
                id="companyAddress"
                value={quoteData.companyAddress}
                onChange={(e) => updateQuoteData("companyAddress", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyPhone">Telefon</Label>
                <Input
                  id="companyPhone"
                  value={quoteData.companyPhone}
                  onChange={(e) => updateQuoteData("companyPhone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">E-posta</Label>
                <Input
                  id="companyEmail"
                  value={quoteData.companyEmail}
                  onChange={(e) => updateQuoteData("companyEmail", e.target.value)}
                />
              </div>
            </div>

                {/* Logo Yükleme ve Renk Analizi */}
                <div className="border-t border-gray-200 pt-6">
                  <Label className="text-base font-semibold text-gray-800 mb-4 block">Şirket Logosu ve Teklif Şablonu Tema Rengi</Label>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="logoUpload" className="text-sm text-gray-600 mb-2 block">
                          Logo Yükle (PNG, JPG, SVG)
                        </Label>
                        <div className="mt-1">
                          <input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="logoUpload"
                            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Upload className="w-5 h-5" />
                            Logo Seç
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Teklif Şablonu Tema Rengi:</span>
                          <div className="relative">
                            <div 
                              className="w-10 h-10 rounded-xl border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                              style={{ backgroundColor: dominantColor }}
                              title={`Seçili renk: ${dominantColor}`}
                              onClick={() => setShowColorPalette(!showColorPalette)}
                            />
                            
                            {/* Renk Paleti */}
                            {showColorPalette && (
                              <div className="absolute top-full right-0 mt-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 min-w-[320px] backdrop-blur-sm" data-color-palette>
                                <div className="mb-4">
                                  <Label className="text-sm font-semibold text-gray-800 mb-3 block">
                                    Teklif Şablonu Renk Paleti
                                  </Label>
                                  <div className="grid grid-cols-8 gap-3">
                                    {colorPalette.map((color) => (
                                      <button
                                        key={color}
                                        type="button"
                                        className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-110 shadow-md ${
                                          dominantColor === color ? 'border-gray-800 scale-110 ring-2 ring-blue-500' : 'border-gray-300'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorSelect(color)}
                                        title={color}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-4">
                                  <Label className="text-sm font-semibold text-gray-800 mb-3 block">
                                    Özel Renk
                                  </Label>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="color"
                                      value={dominantColor}
                                      onChange={handleCustomColorChange}
                                      className="w-10 h-10 border-2 border-gray-300 rounded-xl cursor-pointer shadow-md"
                                    />
                                    <input
                                      type="text"
                                      value={dominantColor}
                                      onChange={(e) => setDominantColor(e.target.value)}
                                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                      placeholder="#000000"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div 
                                      className="w-6 h-6 rounded-lg border border-gray-300 shadow-sm"
                                      style={{ backgroundColor: dominantColor }}
                                    />
                                    <span className="font-medium">Seçili: {dominantColor}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {logoPreview && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleManualColorAnalysis}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-200 shadow-sm"
                          >
                            <Palette className="w-4 h-4" />
                            {isAnalyzing ? 'Analiz...' : 'Logo Rengini Kullan'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Logo Önizleme */}
                    {logoPreview && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">Logo Önizleme:</span>
                          <div className="relative">
                            <img
                              ref={logoRef}
                              src={logoPreview}
                              alt="Logo önizleme"
                              className="max-h-20 max-w-40 object-contain border-2 border-gray-200 rounded-xl shadow-md bg-white p-2"
                            />
                            {isAnalyzing && (
                              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl backdrop-blur-sm">
                                <div className="text-sm text-gray-600 font-medium">Analiz ediliyor...</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                            setDominantColor('#6b7280');
                          }}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Renk Bilgisi */}
                    <div className="text-xs text-gray-500">
                      <p>• Renk kutusuna tıklayarak renk paletinden teklif şablonu tema rengi seçebilirsiniz</p>
                      <p>• Logo yükleyerek otomatik renk analizi yapabilirsiniz</p>
                      <p>• Seçilen renk PDF'te teklif şablonu tema rengi olarak kullanılır</p>
                    </div>
                  </div>
                </div>
          </CardContent>
        </Card>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-3 text-orange-900">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  Seçilen Ürünler ({quoteData.products.length})
                </CardTitle>
                {quoteData.products.length > 0 && (
                  <p className="text-sm text-orange-700 mt-2 font-medium">
                    Toplam: {subtotal.toLocaleString("tr-TR")} ₺
                  </p>
                )}
              </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Ürün Ekle
                </Button>
              </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                  <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-xl border-b border-blue-100">
                    <DialogTitle className="flex items-center gap-3 text-blue-900 text-xl">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      Ürün Kataloğu
                    </DialogTitle>
                </DialogHeader>

                  <div className="space-y-6 p-6">
                  <div className="relative">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Ürün adı, kodu veya kategoriye göre ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>

                    <div className="grid gap-6 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {filteredProducts.map((product) => {
                        const isAlreadyAdded = quoteData.products.some(p => p.code === product.code);
                        const existingProduct = quoteData.products.find(p => p.code === product.code);
                        
                        return (
                      <div
                        key={product.id}
                            className={`border-2 rounded-2xl p-6 hover:shadow-xl cursor-pointer transition-all duration-300 ${
                          !product.inStock ? "opacity-50" : ""
                            } ${isAlreadyAdded ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"}`}
                        onClick={() => product.inStock && addProductFromCatalog(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="font-bold text-xl text-gray-900">{product.name}</span>
                                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                {product.category}
                              </span>
                                  {isAlreadyAdded && (
                                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 font-medium">
                                      <Check className="w-4 h-4" />
                                      {existingProduct?.quantity || 0} tane eklediniz
                                    </span>
                                  )}
                              {!product.inStock && (
                                    <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">Stokta Yok</span>
                              )}
                            </div>
                                <p className="text-gray-600 mb-3 leading-relaxed">{product.description}</p>
                                <div className="flex items-center gap-6 text-sm">
                                  <span className="font-semibold text-gray-700">Kod: {product.code}</span>
                                  <span className="text-gray-600">Birim: {product.unit}</span>
                                  <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                                    KDV: %{product.taxRate}
                                  </span>
                                </div>
                          </div>
                          <div className="text-right">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                              {(product.unitPrice ?? 0).toLocaleString("tr-TR")} ₺
                            </div>
                                <div className="text-sm text-gray-500 mb-2">/{product.unit}</div>
                          </div>
                        </div>
                      </div>
                        );
                      })}

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">Arama kriterlerinize uygun ürün bulunamadı.</div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {quoteData.products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ürün eklenmemiş</h3>
                <p className="text-gray-500 mb-4">"Ürün Ekle" butonunu kullanarak katalogdan ürün seçin</p>
                <Button 
                  size="sm" 
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  İlk Ürünü Ekle
                </Button>
            </div>
          ) : (
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar p-4">
              {quoteData.products.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1">{product.name}</div>
                      <div className="text-sm text-gray-600 mb-2">
                      {product.code} - {product.description}
                    </div>
                      <div className="text-sm text-gray-500 font-medium">
                      Birim Fiyat: {(product.unitPrice ?? 0).toLocaleString("tr-TR")} ₺/{product.unit}
                    </div>
                      <div className="text-sm text-gray-500 font-medium">
                      KDV Oranı: %{product.taxRate}
                    </div>
                  </div>
                    <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                        <Label htmlFor={`quantity-${product.id}`} className="text-sm font-medium text-gray-700">
                        Miktar:
                      </Label>
                      <Input
                        id={`quantity-${product.id}`}
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => updateProductQuantity(product.id, Number.parseInt(e.target.value) || 1)}
                          className="w-24 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                        <span className="text-sm text-gray-600 font-semibold">{product.unit}</span>
                    </div>
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`product-discount-${product.id}`} className="text-sm font-medium text-gray-700">
                          İndirim(₺):
                        </Label>
                        <Input
                          id={`product-discount-${product.id}`}
                          type="number"
                          min="0"
                          value={product.discount || 0}
                          onChange={(e) => updateProductDiscount(product.id, Number(e.target.value) || 0)}
                          className="w-24 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Label htmlFor={`taxRate-${product.id}`} className="text-sm font-medium text-gray-700">
                        KDV:
                      </Label>
                      <select
                        id={`taxRate-${product.id}`}
                        value={product.taxRate}
                        onChange={(e) => updateProductTaxRate(product.id, Number(e.target.value))}
                        className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
                      >
                        <option value={0}>0%</option>
                        <option value={1}>1%</option>
                        <option value={10}>10%</option>
                        <option value={18}>18%</option>
                        <option value={20}>20%</option>
                      </select>
                    </div>
                      <div className="text-right min-w-[120px]">
                        <div className="font-bold text-lg text-green-600">
                        {((product.quantity * (product.unitPrice ?? 0) - (product.discount || 0)) * (1 + product.taxRate / 100)).toLocaleString("tr-TR")} ₺
                      </div>
                    </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeProduct(product.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                      >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

        {/* Hesaplama Ayarları ve Özet - Yan Yana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Taraf - Hesaplama Ayarları */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                Hesaplama Ayarları
              </CardTitle>
        </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6">
            <div>
                  <Label htmlFor="discount" className="text-sm font-medium text-gray-700 mb-2 block">İndirim (₺)</Label>
              <Input
                id="discount"
                type="number"
                    min={0}
                value={quoteData.discount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuoteData("discount", Math.max(0, Number(e.target.value)))}
                    className="border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Sağ Taraf - Teklif Özeti */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-3 text-emerald-900">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-white" />
                </div>
                Teklif Özeti
              </CardTitle>
        </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                    <span className="font-medium text-gray-700">Ara Toplam:</span>
                    <span className="font-bold text-gray-900">{subtotal.toLocaleString("tr-TR")} ₺</span>
                </div>
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                    <span className="font-medium text-gray-700">Ürün İndirimleri:</span>
                    {totalProductDiscount > 0 ? (
                      <span className="font-bold text-red-600">-{totalProductDiscount.toLocaleString("tr-TR")} ₺</span>
                    ) : (
                      <span className="text-sm text-gray-500">Henüz indirim girilmedi</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                    <span className="font-medium text-gray-700">KDV (Ürün Bazında):</span>
                    {taxAmount > 0 ? (
                      <span className="font-bold text-gray-900">{taxAmount.toLocaleString("tr-TR")} ₺</span>
                    ) : (
                      <span className="text-sm text-gray-500">Henüz hesaplanmadı</span>
                    )}
                </div>
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                    <span className="font-medium text-gray-700">Genel İndirim:</span>
                    {quoteData.discount > 0 ? (
                      <span className="font-bold text-red-600">-{quoteData.discount.toLocaleString("tr-TR")} ₺</span>
                    ) : (
                      <span className="text-sm text-gray-500">Henüz indirim girilmedi</span>
                    )}
                </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-emerald-700">Genel Toplam:</span>
                    <span className="text-2xl font-bold text-emerald-600">{grandTotal.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
          </div>

              <Button 
                onClick={generatePDF} 
                disabled={quoteData.products.length === 0} 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-4 text-lg font-semibold rounded-xl" 
                size="lg"
              >
                <FileText className="w-6 h-6 mr-3" />
              PDF Önizleme ve Oluştur
            </Button>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
