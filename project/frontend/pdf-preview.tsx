"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Search, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Product {
  id: string
  code: string
  name: string
  description: string
  unitPrice: number
  quantity: number
  unit: string
  taxRate: number
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

export default function PDFPreview() {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNo: "TKL-2024-001",
    preparedBy: "Ahmet Yılmaz",
    customerName: "ABC Teknoloji Ltd. Şti.",
    quoteDate: "15.01.2024",
    validUntil: "14.02.2024",
    quoteTitle: "Sunucu Donanım Teklifi",
    companyName: "ŞİRKET ADI",
    companyAddress: "Örnek Mahalle, Örnek Sokak No:1",
    companyPhone: "+90 212 123 45 67",
    companyEmail: "info@sirket.com",
    taxRate: 20,
    discount: 3000,
    products: [
      {
        id: "1",
        code: "P12345",
        name: "Dell PowerEdge R750",
        description: "Intel Xeon Silver 4314, 32GB RAM, 2x480GB SSD, RAID Controller, 3 Yıl Garanti",
        unitPrice: 45000,
        quantity: 2,
        unit: "Adet",
        taxRate: 20,
      },
      {
        id: "2",
        code: "P67890",
        name: "Cisco Catalyst 2960-X",
        description: "24 Port Gigabit Switch, Layer 2, PoE+ Destekli, Yönetilebilir",
        unitPrice: 8500,
        quantity: 1,
        unit: "Adet",
        taxRate: 20,
      },
      {
        id: "3",
        code: "S99999",
        name: "Kurulum ve Yapılandırma",
        description: "Profesyonel kurulum, yapılandırma, test ve devreye alma hizmeti",
        unitPrice: 5000,
        quantity: 1,
        unit: "Adet",
        taxRate: 20,
      },
    ],
  })

  const [catalogProducts] = useState<CatalogProduct[]>([
    {
      id: "cat1",
      code: "P12345",
      name: "Dell PowerEdge R750",
      description: "Intel Xeon Silver 4314, 32GB RAM, 2x480GB SSD, RAID Controller, 3 Yıl Garanti",
      unitPrice: 45000,
      unit: "Adet",
      category: "Sunucu",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat2",
      code: "P67890",
      name: "Cisco Catalyst 2960-X",
      description: "24 Port Gigabit Switch, Layer 2, PoE+ Destekli, Yönetilebilir",
      unitPrice: 8500,
      unit: "Adet",
      category: "Network",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat3",
      code: "P11111",
      name: "VMware vSphere Standard",
      description: "Sanallaştırma Yazılımı, 1 CPU Lisansı, Teknik Destek Dahil",
      unitPrice: 12000,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat4",
      code: "P22222",
      name: "HP ProLiant DL380",
      description: "Intel Xeon Gold 5218, 64GB RAM, 4x1TB SSD, RAID 5",
      unitPrice: 65000,
      unit: "Adet",
      category: "Sunucu",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat5",
      code: "P33333",
      name: "Fortinet FortiGate 60F",
      description: "Next-Gen Firewall, 10x GE RJ45, 2x SFP, VPN Desteği",
      unitPrice: 15000,
      unit: "Adet",
      category: "Güvenlik",
      inStock: false,
      taxRate: 20,
    },
    {
      id: "cat6",
      code: "P44444",
      name: "Microsoft Windows Server 2022",
      description: "Standard Edition, 16 Core Lisansı, CAL Dahil",
      unitPrice: 8500,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat7",
      code: "P55555",
      name: "Lenovo ThinkSystem SR650",
      description: "Intel Xeon Silver 4210R, 32GB RAM, 2x600GB SAS",
      unitPrice: 52000,
      unit: "Adet",
      category: "Sunucu",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat8",
      code: "P66666",
      name: "Ubiquiti UniFi Dream Machine",
      description: "All-in-One Security Gateway, 8 Port PoE+, WiFi 6",
      unitPrice: 4500,
      unit: "Adet",
      category: "Network",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat9",
      code: "P77777",
      name: "Veeam Backup & Replication",
      description: "Enterprise Plus Edition, 10 VM Lisansı",
      unitPrice: 18000,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat10",
      code: "P88888",
      name: "APC Smart-UPS 3000VA",
      description: "Online UPS, LCD Display, Network Card Dahil",
      unitPrice: 12500,
      unit: "Adet",
      category: "Güç",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat11",
      code: "P99999",
      name: "SonicWall TZ570",
      description: "Next-Gen Firewall, 7 Port, VPN Desteği, 1 Yıl Lisans",
      unitPrice: 7800,
      unit: "Adet",
      category: "Güvenlik",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat12",
      code: "P10101",
      name: "Synology DiskStation DS920+",
      description: "4-Bay NAS, Intel Celeron J4125, 4GB RAM",
      unitPrice: 6200,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat13",
      code: "P11011",
      name: "Adobe Creative Suite",
      description: "Photoshop, Illustrator, InDesign - 1 Yıllık Lisans",
      unitPrice: 3500,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat14",
      code: "P12121",
      name: "Epson WorkForce Pro WF-C5790",
      description: "Renkli İnkjet Yazıcı, A4, WiFi, Ethernet",
      unitPrice: 4800,
      unit: "Adet",
      category: "Ofis",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat15",
      code: "P13131",
      name: "Logitech MX Master 3S",
      description: "Kablosuz Mouse, Ergonomik Tasarım, 8000 DPI",
      unitPrice: 850,
      unit: "Adet",
      category: "Aksesuar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat16",
      code: "P14141",
      name: "Samsung 970 EVO Plus 1TB",
      description: "NVMe M.2 SSD, 3500MB/s Okuma, 3300MB/s Yazma",
      unitPrice: 2800,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat17",
      code: "P15151",
      name: "Autodesk AutoCAD 2024",
      description: "Profesyonel CAD Yazılımı, 1 Yıllık Lisans",
      unitPrice: 8500,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat18",
      code: "P16161",
      name: "Brother HL-L2350DW",
      description: "Lazer Yazıcı, Siyah-Beyaz, WiFi, Ethernet",
      unitPrice: 3200,
      unit: "Adet",
      category: "Ofis",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat19",
      code: "P17171",
      name: "TP-Link Archer C6",
      description: "AC1200 Dual Band WiFi Router, Gigabit Ports",
      unitPrice: 650,
      unit: "Adet",
      category: "Network",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat20",
      code: "P18181",
      name: "Kingston Fury Beast 32GB",
      description: "DDR4 3200MHz RAM, CL16, 2x16GB Kit",
      unitPrice: 1200,
      unit: "Kit",
      category: "Donanım",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat21",
      code: "P19191",
      name: "Microsoft Office 365",
      description: "Business Premium, 5 Kullanıcı, 1 Yıllık Lisans",
      unitPrice: 4200,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat22",
      code: "P20202",
      name: "Canon EOS R6 Mark II",
      description: "Full Frame Mirrorless Kamera, 24.2MP, 4K Video",
      unitPrice: 45000,
      unit: "Adet",
      category: "Fotoğraf",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat23",
      code: "P21212",
      name: "ASUS ROG Strix G15",
      description: "Gaming Laptop, RTX 4060, 16GB RAM, 512GB SSD",
      unitPrice: 35000,
      unit: "Adet",
      category: "Bilgisayar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat24",
      code: "P22222",
      name: "Western Digital Red 4TB",
      description: "NAS HDD, 5400RPM, 64MB Cache, 3.5\"",
      unitPrice: 2800,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat25",
      code: "P23232",
      name: "Avast Business Antivirus",
      description: "Pro Plus Edition, 10 Cihaz, 1 Yıllık Lisans",
      unitPrice: 1800,
      unit: "Lisans",
      category: "Güvenlik",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat26",
      code: "P24242",
      name: "LG 27UL850-W",
      description: "27\" 4K Ultra HD Monitor, USB-C, HDR400",
      unitPrice: 8500,
      unit: "Adet",
      category: "Monitör",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat27",
      code: "P25252",
      name: "Intel Core i9-13900K",
      description: "24 Core, 32 Thread, 5.8GHz Max, LGA1700",
      unitPrice: 18500,
      unit: "Adet",
      category: "Donanım",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat28",
      code: "P26262",
      name: "Adobe Photoshop CC",
      description: "Creative Cloud, 1 Yıllık Lisans, Tüm Uygulamalar",
      unitPrice: 6500,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat29",
      code: "P27272",
      name: "Corsair RM850x",
      description: "850W 80+ Gold PSU, Fully Modular, 10 Yıl Garanti",
      unitPrice: 4200,
      unit: "Adet",
      category: "Güç",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat30",
      code: "P28282",
      name: "Sony WH-1000XM5",
      description: "Kablosuz Gürültü Önleyici Kulaklık, 30 Saat Pil",
      unitPrice: 8500,
      unit: "Adet",
      category: "Aksesuar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat31",
      code: "P29292",
      name: "Dell UltraSharp U2723QE",
      description: "27\" 4K Monitor, USB-C Hub, 99% sRGB",
      unitPrice: 9200,
      unit: "Adet",
      category: "Monitör",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat32",
      code: "P30303",
      name: "NVIDIA RTX 4080",
      description: "16GB GDDR6X, Ray Tracing, DLSS 3.0",
      unitPrice: 45000,
      unit: "Adet",
      category: "Donanım",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat33",
      code: "P31313",
      name: "Zoom Pro License",
      description: "Aylık Lisans, Sınırsız Toplantı, Cloud Recording",
      unitPrice: 350,
      unit: "Aylık",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat34",
      code: "P32323",
      name: "Apple MacBook Pro 14",
      description: "M3 Pro, 18GB RAM, 512GB SSD, Space Gray",
      unitPrice: 85000,
      unit: "Adet",
      category: "Bilgisayar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat35",
      code: "P33333",
      name: "Seagate IronWolf 8TB",
      description: "NAS HDD, 7200RPM, 256MB Cache, CMR",
      unitPrice: 5200,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat36",
      code: "P34343",
      name: "Razer BlackWidow V3 Pro",
      description: "Kablosuz Mekanik Klavye, RGB, Tactile Switch",
      unitPrice: 3200,
      unit: "Adet",
      category: "Aksesuar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat37",
      code: "P35353",
      name: "Microsoft Surface Pro 9",
      description: "13\" 2-in-1 Tablet, Intel i7, 16GB RAM, 256GB SSD",
      unitPrice: 42000,
      unit: "Adet",
      category: "Bilgisayar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat38",
      code: "P36363",
      name: "Gigabyte B760 AORUS Elite",
      description: "ATX Anakart, LGA1700, DDR5, WiFi 6E",
      unitPrice: 4800,
      unit: "Adet",
      category: "Donanım",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat39",
      code: "P37373",
      name: "Adobe Premiere Pro",
      description: "Video Düzenleme Yazılımı, 1 Yıllık Lisans",
      unitPrice: 3800,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat40",
      code: "P38383",
      name: "HP LaserJet Pro M404n",
      description: "Siyah-Beyaz Lazer Yazıcı, 38 Sayfa/Dakika",
      unitPrice: 2800,
      unit: "Adet",
      category: "Ofis",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat41",
      code: "P39393",
      name: "Netgear GS308",
      description: "8 Port Gigabit Switch, Plug & Play",
      unitPrice: 450,
      unit: "Adet",
      category: "Network",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat42",
      code: "P40404",
      name: "Samsung Odyssey G9",
      description: "49\" Ultrawide Gaming Monitor, 240Hz, 1ms",
      unitPrice: 25000,
      unit: "Adet",
      category: "Monitör",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat43",
      code: "P41414",
      name: "AMD Ryzen 9 7950X",
      description: "16 Core, 32 Thread, 5.7GHz Max, AM5",
      unitPrice: 22000,
      unit: "Adet",
      category: "Donanım",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat44",
      code: "P42424",
      name: "SketchUp Pro 2024",
      description: "3D Modelleme Yazılımı, 1 Yıllık Lisans",
      unitPrice: 5200,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat45",
      code: "P43434",
      name: "Epson EcoTank ET-4760",
      description: "Renkli Tanklı Yazıcı, WiFi, Tarayıcı, Kopyalayıcı",
      unitPrice: 3800,
      unit: "Adet",
      category: "Ofis",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat46",
      code: "P44444",
      name: "Cisco RV340",
      description: "Dual WAN VPN Router, Gigabit, 4 Port",
      unitPrice: 3200,
      unit: "Adet",
      category: "Network",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat47",
      code: "P45454",
      name: "BenQ PD2700U",
      description: "27\" 4K Designer Monitor, 99% Adobe RGB",
      unitPrice: 12000,
      unit: "Adet",
      category: "Monitör",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat48",
      code: "P46464",
      name: "Crucial P5 Plus 2TB",
      description: "NVMe M.2 SSD, 6600MB/s Okuma, 5000MB/s Yazma",
      unitPrice: 4800,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat49",
      code: "P47474",
      name: "Kaspersky Endpoint Security",
      description: "Cloud Edition, 50 Cihaz, 1 Yıllık Lisans",
      unitPrice: 8500,
      unit: "Lisans",
      category: "Güvenlik",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat50",
      code: "P48484",
      name: "Behringer U-Phoria UMC404HD",
      description: "4 Kanal USB Ses Kartı, 24-bit/192kHz",
      unitPrice: 1800,
      unit: "Adet",
      category: "Aksesuar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat51",
      code: "P49494",
      name: "Lenovo ThinkPad X1 Carbon",
      description: "14\" Ultrabook, Intel i7, 16GB RAM, 512GB SSD",
      unitPrice: 38000,
      unit: "Adet",
      category: "Bilgisayar",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat52",
      code: "P50505",
      name: "EVGA SuperNOVA 1000W",
      description: "1000W 80+ Platinum PSU, Fully Modular",
      unitPrice: 6800,
      unit: "Adet",
      category: "Güç",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat53",
      code: "P51515",
      name: "Final Cut Pro X",
      description: "Mac Video Düzenleme Yazılımı, Kalıcı Lisans",
      unitPrice: 12000,
      unit: "Lisans",
      category: "Yazılım",
      inStock: true,
      taxRate: 18,
    },
    {
      id: "cat54",
      code: "P52525",
      name: "Toshiba N300 6TB",
      description: "NAS HDD, 7200RPM, 128MB Cache, 3.5\"",
      unitPrice: 3800,
      unit: "Adet",
      category: "Depolama",
      inStock: true,
      taxRate: 20,
    },
    {
      id: "cat55",
      code: "P53535",
      name: "Wacom Cintiq 22",
      description: "22\" Çizim Tableti, 1920x1080, Stylus",
      unitPrice: 28000,
      unit: "Adet",
      category: "Aksesuar",
      inStock: true,
      taxRate: 20,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const subtotal = quoteData.products.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0)
  const taxAmount = quoteData.products.reduce((sum, product) => sum + (product.unitPrice * product.quantity * product.taxRate / 100), 0)
  const grandTotal = subtotal + taxAmount - quoteData.discount

  const addProductFromCatalog = (catalogProduct: CatalogProduct) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      code: catalogProduct.code,
      name: catalogProduct.name,
      description: catalogProduct.description,
      unitPrice: catalogProduct.unitPrice,
      quantity: 1,
      unit: catalogProduct.unit,
      taxRate: catalogProduct.taxRate,
    }
    setQuoteData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
    setIsDialogOpen(false)
  }

  const removeProduct = (id: string) => {
    setQuoteData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
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

  const generatePDF = async () => {
    setIsGeneratingPDF(true)

    try {
      // PDF oluşturma ekranına yönlendir
      const queryParams = new URLSearchParams({
        data: JSON.stringify(quoteData),
      }).toString()

      window.location.href = `/pdf-generator?${queryParams}`
    } catch (error) {
      console.error("PDF oluşturma hatası:", error)
      alert("PDF oluşturma ekranına yönlendirilirken bir hata oluştu.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const filteredProducts = catalogProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Alanı */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teklif Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quoteNo">Teklif No</Label>
                  <Input
                    id="quoteNo"
                    value={quoteData.quoteNo}
                    onChange={(e) => updateQuoteData("quoteNo", e.target.value)}
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
                    value={quoteData.quoteDate}
                    onChange={(e) => updateQuoteData("quoteDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Geçerlilik Tarihi</Label>
                  <Input
                    id="validUntil"
                    value={quoteData.validUntil}
                    onChange={(e) => updateQuoteData("validUntil", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quoteTitle">Teklif Başlığı</Label>
                <Input
                  id="quoteTitle"
                  value={quoteData.quoteTitle}
                  onChange={(e) => updateQuoteData("quoteTitle", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Şirket Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seçilen Ürünler ({quoteData.products.length})</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ürün Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Ürün Kataloğu</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Ürün adı, kodu veya kategoriye göre ara..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="grid gap-4 max-h-96 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !product.inStock ? "opacity-50" : ""
                            }`}
                            onClick={() => product.inStock && addProductFromCatalog(product)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-lg">{product.name}</span>
                                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {product.category}
                                  </span>
                                  {!product.inStock && (
                                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                                      Stokta Yok
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="font-medium">Kod: {product.code}</span>
                                  <span>Birim: {product.unit}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {product.unitPrice != null ? product.unitPrice.toLocaleString("tr-TR") : "-"} ₺
                                </div>
                                <div className="text-sm text-gray-500">/{product.unit}</div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {filteredProducts.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            Arama kriterlerinize uygun ürün bulunamadı.
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {quoteData.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz ürün eklenmemiş. "Ürün Ekle" butonunu kullanarak katalogdan ürün seçin.
                </div>
              ) : (
                <div className="space-y-3">
                  {quoteData.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.code} - {product.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.quantity} {product.unit} × {product.unitPrice != null ? product.unitPrice.toLocaleString("tr-TR") : "-"} ₺ ={" "}
                          {(product.quantity * product.unitPrice * (1 + product.taxRate / 100)).toLocaleString("tr-TR")} ₺ (KDV Dahil)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`quantity-${product.id}`} className="text-sm font-medium text-gray-700">
                            Miktar:
                          </Label>
                          <Input
                            id={`quantity-${product.id}`}
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product.id, Number.parseInt(e.target.value) || 1)}
                            className="w-20 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`taxRate-${product.id}`} className="text-sm font-medium text-gray-700">
                            KDV:
                          </Label>
                          <select
                            id={`taxRate-${product.id}`}
                            value={product.taxRate}
                            onChange={(e) => updateProductTaxRate(product.id, Number(e.target.value))}
                            className="w-16 border-2 border-gray-200 rounded-lg px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm"
                          >
                            <option value={0}>0%</option>
                            <option value={1}>1%</option>
                            <option value={10}>10%</option>
                            <option value={18}>18%</option>
                            <option value={20}>20%</option>
                          </select>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeProduct(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hesaplama Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="discount">İndirim (₺)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={quoteData.discount}
                    onChange={(e) => updateQuoteData("discount", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Oluştur Butonu */}
          <Card>
            <CardHeader>
              <CardTitle>PDF İşlemleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF || quoteData.products.length === 0}
                  className="flex-1"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      PDF Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      PDF Oluştur
                    </>
                  )}
                </Button>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">PDF Oluşturma:</p>
                    <p>Bu buton teklif verilerini PDF oluşturma ekranına gönderecek.</p>
                    <p className="mt-1">
                      <strong>Toplam Tutar:</strong> {grandTotal.toLocaleString("tr-TR")} ₺ |
                      <strong> Ürün Sayısı:</strong> {quoteData.products.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Önizleme Alanı */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            {/* A4 Sayfa Simülasyonu */}
            <div className="p-8 bg-white" style={{ aspectRatio: "210/297" }}>
              {/* Header */}
              <div className="border-b-2 border-gray-700 pb-4 mb-8">
                <div className="flex justify-between items-start">
                  <div className="w-32 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-gray-500 rounded-lg">
                    LOGO
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-700 mb-1">{quoteData.companyName}</div>
                    <div className="text-xs text-gray-600 leading-tight">
                      {quoteData.companyAddress}
                      <br />
                      Tel: {quoteData.companyPhone}
                      <br />
                      E-posta: {quoteData.companyEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Başlık */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">FİYAT TEKLİFİ</h1>
              </div>

              {/* Teklif Bilgileri */}
              <div className="mb-6">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200 w-1/4">Teklif No:</td>
                      <td className="p-2 border-r border-gray-200 w-1/4">{quoteData.quoteNo}</td>
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200 w-1/4">Hazırlayan:</td>
                      <td className="p-2 w-1/4">{quoteData.preparedBy}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200">Müşteri/Firma:</td>
                      <td className="p-2 border-r border-gray-200">{quoteData.customerName}</td>
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200">Teklif Tarihi:</td>
                      <td className="p-2">{quoteData.quoteDate}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200">Teklif Başlığı:</td>
                      <td className="p-2 border-r border-gray-200">{quoteData.quoteTitle}</td>
                      <td className="bg-gray-50 font-semibold p-2 border-r border-gray-200">Geçerlilik:</td>
                      <td className="p-2">{quoteData.validUntil}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ürünler Bölümü */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-700">
                  Teklif Edilen Ürünler
                </h2>

                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="p-2 text-left w-20">Ürün Kodu</th>
                      <th className="p-2 text-left">Ürün Adı & Açıklama</th>
                      <th className="p-2 text-left w-20">Birim Fiyat</th>
                      <th className="p-2 text-center w-20">Miktar</th>
                      <th className="p-2 text-right w-24">Ara Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteData.products.map((product, index) => (
                      <tr
                        key={product.id}
                        className={index % 2 === 1 ? "bg-gray-50 border-b border-gray-200" : "border-b border-gray-200"}
                      >
                        <td className="p-2">
                          <div className="font-semibold text-gray-700">{product.code}</div>
                        </td>
                        <td className="p-2">
                          <div className="font-semibold mb-1">{product.name}</div>
                          <div className="text-gray-600">{product.description}</div>
                        </td>
                        <td className="p-2 text-right font-semibold">{product.unitPrice != null ? product.unitPrice.toLocaleString("tr-TR") : "-"} ₺</td>
                        <td className="p-2 text-center">
                          {product.quantity} {product.unit}
                        </td>
                        <td className="p-2 text-right font-semibold text-gray-900">
                          {(product.unitPrice * product.quantity).toLocaleString("tr-TR")} ₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Toplam Hesaplama */}
                <div className="mt-4 flex justify-end">
                  <table className="w-64 border-collapse text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 text-right font-semibold">Ara Toplam:</td>
                        <td className="p-2 text-right">{subtotal.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 text-right font-semibold">KDV ({quoteData.taxRate}%):</td>
                        <td className="p-2 text-right">{taxAmount.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 text-right font-semibold">İndirim:</td>
                        <td className="p-2 text-right">-{quoteData.discount.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                      <tr className="bg-gray-700 text-white">
                        <td className="p-2 text-right font-bold">GENEL TOPLAM:</td>
                        <td className="p-2 text-right font-bold">{grandTotal.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-3 border-t border-gray-200 text-center text-xs text-gray-600">
                Bu teklif 30 gün süreyle geçerlidir. | www.sirket.com | {quoteData.companyEmail} |{" "}
                {quoteData.companyPhone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
