<?php

namespace App\Imports;

use App\Models\Product;
use Illuminate\Support\Collection;


class ProductsImport implements ToCollection, WithHeadingRow
{
    public $errors = [];
    public $successCount = 0;

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // Tüm başlıkları küçük harfe çevir
            $row = collect($row)->keyBy(function($v, $k) { return mb_strtolower($k); })->all();
            $rowNumber = $index + 2; // 1. satır başlık
            $productName = $row['ürün adı'] ?? $row['urun adi'] ?? $row['product name'] ?? null;
            $productCode = $row['kod'] ?? $row['code'] ?? null;
            $unit = $row['birim'] ?? $row['unit'] ?? null;
            $vat = $row['kdv'] ?? $row['vat'] ?? null;
            $description = $row['açıklama'] ?? $row['aciklama'] ?? $row['description'] ?? null;
            $unitPrice = $row['birim fiyatı'] ?? $row['birim fiyati'] ?? $row['unit price'] ?? $row['unit_price'] ?? null;

            // Zorunlu alan kontrolü
            if (!$productName || !$productCode || !$unit || !$vat) {
                $this->errors[] = [
                    'row' => $rowNumber,
                    'error' => 'Zorunlu alan(lar) eksik'
                ];
                continue;
            }

            // KDV formatı
            $vat = str_replace('%', '', $vat);
            if (!is_numeric($vat)) {
                $this->errors[] = [
                    'row' => $rowNumber,
                    'error' => 'Geçersiz KDV formatı'
                ];
                continue;
            }

            // Benzersiz kod kontrolü ve ekleme/güncelleme
            $product = Product::updateOrCreate(
                ['product_code' => $productCode],
                [
                    'product_name' => $productName,
                    'unit' => $unit,
                    'vat_rate' => (float)$vat,
                    'description' => $description,
                    'unit_price' => $unitPrice !== null ? (float)$unitPrice : null,
                ]
            );
            $this->successCount++;
        }
    }
}
