import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BACKEND_URL = "http://127.0.0.1:8000"; // Gerekirse burayı kendi backend adresinle değiştir

export default function ProductExcelImport({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/import-excel`, {
        method: "POST",
        body: formData,
        // headers: { 'Authorization': 'Bearer ...' } // Gerekirse ekleyin
      });
      const data = await res.json();
      setResult(data);
      if (onSuccess && data.success) {
        onSuccess();
      }
      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Ürünler başarıyla yüklendi!",
        });
        setSuccess("Yükleme işlemi başarılı.");
      } else {
        toast({
          title: "Hata",
          description: "Ürünler yüklenemedi!",
          variant: "destructive"
        });
        setError("Yükleme sırasında bir hata oluştu.");
      }
    } catch (err) {
      toast({
        title: "Hata",
        description: "Ürünler yüklenemedi!",
        variant: "destructive"
      });
      setError("Yükleme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-blue-300 shadow-blue-100">
      <CardHeader>
        <CardTitle>Excel ile Toplu Ürün Yükle</CardTitle>
        <CardDescription>Excel dosyanızı yükleyerek birden fazla ürünü hızlıca ekleyin.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="excel-upload">Excel Dosyası</Label>
          <Input
            id="excel-upload"
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Yükleniyor..." : "Yükle"}
          </Button>
          <a
            href="/ornek-urunler.xlsx"
            download
            className="px-4 py-2 bg-gray-200 rounded text-sm font-medium flex items-center"
          >
            Örnek Excel İndir
          </a>
        </div>
        {result && (
          <div className="mt-4">
            <div className="mb-2">Başarılı kayıt: <b>{result.success}</b></div>
            {result.errors && result.errors.length > 0 && (
              <table className="w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Satır</th>
                    <th className="border px-2 py-1">Hata</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err: any, i: number) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{err.row}</td>
                      <td className="border px-2 py-1">{err.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch">
        {error && <span className="text-red-500 font-medium text-center">{error}</span>}
        {success && <span className="text-green-600 font-medium text-center">{success}</span>}
      </CardFooter>
    </Card>
  );
} 