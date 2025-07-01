<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class QuotePdfController extends Controller
{
    public function generate(Request $request)
    {
        try {
            $data = $request->all();

            // Default değerler ekle
            $data['companyName'] = $data['companyName'] ?? 'Şirket Adı';
            $data['companyAddress'] = $data['companyAddress'] ?? 'Şirket Adresi';
            $data['companyPhone'] = $data['companyPhone'] ?? 'Telefon';
            $data['companyEmail'] = $data['companyEmail'] ?? 'E-posta';
            $data['quoteTitle'] = $data['quoteTitle'] ?? 'Teklif';
            $data['preparedBy'] = $data['preparedBy'] ?? 'Hazırlayan';
            $data['customerName'] = $data['customerName'] ?? 'Müşteri';
            $data['quoteDate'] = $data['quoteDate'] ?? date('d.m.Y');
            $data['validUntil'] = $data['validUntil'] ?? date('d.m.Y', strtotime('+30 days'));
            $data['quoteNo'] = $data['quoteNo'] ?? 'T-' . date('Ymd') . '-' . rand(1000, 9999);
            $data['taxRate'] = $data['taxRate'] ?? 20;
            $data['discount'] = $data['discount'] ?? 0;

            // Tema rengi ve logo bilgileri
            $data['dominantColor'] = $data['dominantColor'] ?? '#6b7280'; // Varsayılan gri
            $data['logoPreview'] = $data['logoPreview'] ?? null;

            // Logo varsa base64'ten dosyaya çevir
            if ($data['logoPreview']) {
                $logoPath = $this->saveBase64Logo($data['logoPreview']);
                $data['logoPath'] = $logoPath;
            } else {
                $data['logoPath'] = null;
            }

            // PDF için HTML view'ı render et
            $pdf = Pdf::loadView('quote.pdf', $data);

            // DOMPDF ayarları
            $pdf->getDomPDF()->set_option('isHtml5ParserEnabled', true);
            $pdf->getDomPDF()->set_option('isPhpEnabled', true);
            $pdf->getDomPDF()->set_option('defaultFont', 'DejaVu Sans');
            $pdf->getDomPDF()->set_option('defaultMediaType', 'screen');
            $pdf->getDomPDF()->set_option('isFontSubsettingEnabled', true);
            $pdf->getDomPDF()->set_option('isRemoteEnabled', true);
            $pdf->getDomPDF()->set_option('debugKeepTemp', false);
            $pdf->getDomPDF()->set_option('debugCss', false);
            $pdf->getDomPDF()->set_option('debugLayout', false);
            $pdf->getDomPDF()->set_option('debugLayoutLines', false);
            $pdf->getDomPDF()->set_option('debugLayoutBlocks', false);
            $pdf->getDomPDF()->set_option('debugLayoutInline', false);
            $pdf->getDomPDF()->set_option('debugLayoutPaddingBox', false);

            return $pdf->download('teklif.pdf');

        } catch (\Exception $e) {
            \Log::error('PDF Generation Error: ' . $e->getMessage());
            return response()->json(['error' => 'PDF oluşturulurken hata oluştu: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Base64 logo verisini dosyaya kaydet
     */
    private function saveBase64Logo($base64Data)
    {
        try {
            // Base64 verisini temizle
            $base64Data = preg_replace('/^data:image\/[a-z]+;base64,/', '', $base64Data);

            // Geçici dosya adı oluştur
            $filename = 'logo_' . time() . '_' . rand(1000, 9999) . '.png';
            $path = storage_path('app/temp/' . $filename);

            // Temp klasörünü oluştur
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            // Dosyayı kaydet
            file_put_contents($path, base64_decode($base64Data));

            return $path;
        } catch (\Exception $e) {
            \Log::error('Logo save error: ' . $e->getMessage());
            return null;
        }
    }
}
