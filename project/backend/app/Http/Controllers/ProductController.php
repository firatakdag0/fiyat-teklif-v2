<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\ProductsImport;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Product;


class ProductController extends Controller
{
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,txt|max:5120'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $header = array_map('strtolower', $rows[0]);
        $successCount = 0;
        $errors = [];

        foreach (array_slice($rows, 1) as $index => $row) {
            $rowNumber = $index + 2;
            $rowData = array_combine($header, $row);

            $productName = $rowData['ürün adı'] ?? $rowData['urun adi'] ?? $rowData['product name'] ?? null;
            $productCode = $rowData['kod'] ?? $rowData['code'] ?? null;
            $unit = $rowData['birim'] ?? $rowData['unit'] ?? null;
            $vat = $rowData['kdv'] ?? $rowData['vat'] ?? null;
            $description = $rowData['açıklama'] ?? $rowData['aciklama'] ?? $rowData['description'] ?? null;

            if (!$productName || !$productCode || !$unit || !$vat) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => 'Zorunlu alan(lar) eksik'
                ];
                continue;
            }

            $vat = str_replace('%', '', $vat);
            if (!is_numeric($vat)) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => 'Geçersiz KDV formatı'
                ];
                continue;
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
            $successCount++;
        }

        return response()->json([
            'success' => $successCount,
            'errors' => $errors
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string',
            'product_code' => 'required|string|unique:products,product_code',
            'unit' => 'required|string',
            'vat_rate' => 'required|numeric',
            'description' => 'nullable|string',
            'unit_price' => 'nullable|numeric',
        ]);
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Ürün bulunamadı'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Ürün silindi'], 200);
    }
}
