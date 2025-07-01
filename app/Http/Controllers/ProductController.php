<?php

namespace App\Http\Controllers;

use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv|max:5120'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $extension = strtolower($file->getClientOriginalExtension());

        $errors = [];
        $successCount = 0;
        $rowNumber = 1;

        if ($extension === 'csv') {
            // CSV dosyası için PHP'nin yerleşik fonksiyonları
            $handle = fopen($path, 'r');
            $header = fgetcsv($handle);
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;
                $data = array_combine($header, $row);
                $result = $this->processProductRow($data, $rowNumber);
                if ($result !== true) {
                    $errors[] = $result;
                } else {
                    $successCount++;
                }
            }
            fclose($handle);
        } else {
            // XLSX dosyası için PhpSpreadsheet
            $spreadsheet = IOFactory::load($path);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);
            $header = array_map('trim', array_values($rows[1]));
            for ($i = 2; $i <= count($rows); $i++) {
                $rowNumber++;
                $row = array_values($rows[$i]);
                $data = array_combine($header, $row);
                $result = $this->processProductRow($data, $rowNumber);
                if ($result !== true) {
                    $errors[] = $result;
                } else {
                    $successCount++;
                }
            }
        }

        return response()->json([
            'success' => $successCount,
            'errors' => $errors
        ]);
    }

    private function processProductRow($data, $rowNumber)
    {
        $productName = $data['Ürün Adı'] ?? $data['urun adi'] ?? $data['product name'] ?? null;
        $productCode = $data['Kod'] ?? $data['code'] ?? null;
        $unit = $data['Birim'] ?? $data['unit'] ?? null;
        $vat = $data['KDV'] ?? $data['kdv'] ?? $data['vat'] ?? null;
        $description = $data['Açıklama'] ?? $data['aciklama'] ?? $data['description'] ?? null;

        if (!$productName || !$productCode || !$unit || !$vat) {
            return [
                'row' => $rowNumber,
                'error' => 'Zorunlu alan(lar) eksik'
            ];
        }
        $vat = str_replace('%', '', $vat);
        if (!is_numeric($vat)) {
            return [
                'row' => $rowNumber,
                'error' => 'Geçersiz KDV formatı'
            ];
        }
        Product::updateOrCreate(
            ['product_code' => $productCode],
            [
                'product_name' => $productName,
                'unit' => $unit,
                'vat_rate' => (float)$vat,
                'description' => $description
            ]
        );
        return true;
    }
} 