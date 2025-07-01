import React, { useEffect, useState } from "react";
import { Trash2, Search, Plus, Upload } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductExcelImport from "./ProductExcelImport";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  id: number;
  product_name: string;
  product_code: string;
  unit: string;
  vat_rate: number;
  description?: string;
  unit_price?: number;
};

export default function ProductList({ refreshKey }: { refreshKey?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_name: "",
    product_code: "",
    unit: "Adet",
    custom_unit: "",
    vat_rate: 20,
    unit_price: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = "Ürün silinemedi";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch {}
        toast({
          title: "Hata",
          description: msg,
          variant: "destructive"
        });
        console.error("Silme hatası:", res.status, msg);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi!",
        variant: "success"
      });
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err?.message || "Ürün silinirken hata oluştu.",
        variant: "destructive"
      });
      console.error("Silme catch hatası:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/products");
      if (!res.ok) throw new Error("Ürünler alınamadı");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      unit: value,
      custom_unit: value === "Diğer" ? prev.custom_unit : ""
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: form.product_name,
          product_code: form.product_code,
          unit: form.unit === "Diğer" ? form.custom_unit : form.unit,
          vat_rate: Number(form.vat_rate),
          unit_price: form.unit_price ? Number(form.unit_price) : null,
          description: form.description,
        }),
      });
      if (!res.ok) throw new Error("Ürün eklenemedi");
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla eklendi!",
      });
      setForm({ product_name: "", product_code: "", unit: "Adet", custom_unit: "", vat_rate: 20, unit_price: "", description: "" });
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || "Bilinmeyen hata");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Ürün Yönetim Paneli</h1>
          <p className="text-gray-600 max-w-2xl">Ürünlerinizi yönetin, yeni ürün ekleyin veya Excel ile toplu yükleyin. Arama ve silme işlemleriyle kataloğunuzu kolayca düzenleyin.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="mr-2" /> Manuel Ürün Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <Card className="w-full max-w-md mx-auto border-blue-300 shadow-blue-100">
                <CardHeader>
                  <CardTitle>Manuel Ürün Ekle</CardTitle>
                  <CardDescription>Yeni bir ürün ekleyin. Tüm alanları eksiksiz doldurun.</CardDescription>
                </CardHeader>
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="product_name">Ürün Adı</Label>
                      <Input id="product_name" name="product_name" value={form.product_name} onChange={handleFormChange} required placeholder="Ürün Adı" />
                    </div>
                    <div>
                      <Label htmlFor="product_code">Ürün Kodu</Label>
                      <Input id="product_code" name="product_code" value={form.product_code} onChange={handleFormChange} required placeholder="Ürün Kodu" />
                    </div>
                    <div>
                      <Label htmlFor="unit">Birim</Label>
                      <Select value={form.unit} onValueChange={value => setForm(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Adet">Adet</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Paket">Paket</SelectItem>
                          <SelectItem value="Koli">Koli</SelectItem>
                          <SelectItem value="Litre">Litre</SelectItem>
                          <SelectItem value="Metre">Metre</SelectItem>
                          <SelectItem value="Çift">Çift</SelectItem>
                          <SelectItem value="Düzine">Düzine</SelectItem>
                          <SelectItem value="Diğer">Diğer...</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.unit === "Diğer" && (
                        <Input name="custom_unit" value={form.custom_unit} onChange={handleFormChange} placeholder="Birim girin" className="mt-2" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="vat_rate">KDV (%)</Label>
                      <Input id="vat_rate" name="vat_rate" value={form.vat_rate} onChange={handleFormChange} required placeholder="KDV" type="number" min={0} max={100} />
                    </div>
                    <div>
                      <Label htmlFor="unit_price">Birim Fiyatı (₺)</Label>
                      <Input id="unit_price" name="unit_price" value={form.unit_price} onChange={handleFormChange} placeholder="Birim Fiyatı" type="number" step="0.01" min={0} />
                    </div>
                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea id="description" name="description" value={form.description} onChange={handleFormChange} placeholder="Açıklama" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 items-stretch">
                    <Button type="submit" disabled={formLoading} className="w-full text-base h-11 bg-blue-600 hover:bg-blue-700 text-white">{formLoading ? "Ekleniyor..." : "Ekle"}</Button>
                    {formError && <span className="text-red-500 font-medium text-center">{formError}</span>}
                  </CardFooter>
                </form>
              </Card>
            </DialogContent>
          </Dialog>
          <Dialog open={showExcelModal} onOpenChange={setShowExcelModal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="border-blue-300 text-blue-700"><Upload className="mr-2" /> Excel ile Toplu Yükle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excel ile Toplu Ürün Yükle</DialogTitle>
              </DialogHeader>
              <ProductExcelImport onSuccess={fetchProducts} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sağda: Search ve Ürün Kartları Grid */}
        <div className="flex-1 w-full">
          {/* Search Bar */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center w-full max-w-xs gap-2">
              <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ürünlerde ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-4 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 transition w-full"
              />
            </div>
          </div>
          {/* Ürün Kartları Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
            {products.filter(p =>
              p.product_name.toLowerCase().includes(search.toLowerCase()) ||
              p.product_code.toLowerCase().includes(search.toLowerCase()) ||
              (p.description || "").toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">Hiç ürün yok.</div>
            )}
            {products.filter(p =>
              p.product_name.toLowerCase().includes(search.toLowerCase()) ||
              p.product_code.toLowerCase().includes(search.toLowerCase()) ||
              (p.description || "").toLowerCase().includes(search.toLowerCase())
            ).map((p) => (
              <div key={p.id} className="border-2 rounded-2xl p-6 bg-white hover:shadow-xl cursor-pointer transition-all duration-300 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm flex flex-col justify-between min-h-[200px] relative">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full p-1 transition"
                      title="Ürünü Sil"
                      type="button"
                      onClick={e => e.stopPropagation()}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{p.product_name}" adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(p.id)}>Evet, sil</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-xl text-gray-900">{p.product_name}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{p.unit}</span>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed min-h-[40px]">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                    <span className="font-semibold text-gray-700">Kod: {p.product_code}</span>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">KDV: %{p.vat_rate}</span>
                  </div>
                </div>
                <div className="text-right mt-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{p.unit_price ? p.unit_price.toLocaleString("tr-TR") : '-'} ₺</div>
                  <div className="text-sm text-gray-500">/{p.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 