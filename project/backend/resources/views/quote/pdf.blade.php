<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Teklif PDF</title>
    <style>
        @font-face {
            font-family: 'DejaVu Sans';
            src: url('{{ storage_path('fonts/DejaVuSans.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        :root {
            --dominant-color: {{ $dominantColor ?? '#6b7280' }};
            --dominant-color-light: {{ $dominantColor ?? '#6b7280' }}20;
            --dominant-color-dark: {{ $dominantColor ?? '#6b7280' }}dd;
        }

        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            font-size: 9px;
            color: #333;
            margin: 0;
            padding: 10px;
            line-height: 1.2;
            background-color: #ffffff;
        }
        .header {
            width: 100%;
            margin-bottom: 10px;
            border-bottom: 2px solid var(--dominant-color);
            padding-bottom: 8px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .company-section {
            width: 60%;
            vertical-align: top;
        }
        .logo-section {
            width: 40%;
            vertical-align: top;
            text-align: right;
        }
        .company-logo {
            max-width: 95px;
            max-height: 75px;
            margin-bottom: 3px;
            border-radius: 6px;
        }
        .company-name {
            font-size: 12px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 3px;
        }
        .company-details {
            font-size: 8px;
            color: #6b7280;
            line-height: 1.1;
        }
        .company-details div {
            margin-bottom: 1px;
        }
        .quote-header {
            text-align: center;
            margin: 10px 0;
            padding: 8px 0;
            border-top: 1px solid var(--dominant-color);
            border-bottom: 1px solid var(--dominant-color);
        }
        .quote-title {
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 3px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .quote-subtitle {
            font-size: 10px;
            color: #6b7280;
            font-weight: 500;
        }
        .quote-info {
            width: 100%;
            margin-bottom: 8px;
            background-color: var(--dominant-color-light);
            border-radius: 10px;
            padding: 10px 10px;
            border: 1px solid var(--dominant-color);
            font-size: 10px;
            color: #222;
            font-weight: bold;
            line-height: 1.7;
            min-height: 25px;
            box-sizing: border-box;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-left, .info-right {
            width: 50%;
            vertical-align: top;
        }
        .info-item {
            margin-bottom: 3px;
            font-size: 8px;
        }
        .info-label {
            font-weight: bold;
            color: var(--dominant-color);
            font-size: 10px;
        }
        .info-value {
            color: #222;
            font-size: 10px;
            font-weight: bold;
        }
        .products-section {
            margin-bottom: 10px;
        }
        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: var(--dominant-color);
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid var(--dominant-color);
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            border-radius: 6px;
            overflow: hidden;
        }
        .products-table th {
            background-color: var(--dominant-color);
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
        }
        .products-table td {
            padding: 7px 6px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }
        .products-table tr:nth-child(even) {
            background-color: var(--dominant-color-light);
        }
        .page-break {
            page-break-before: always;
        }
        .page-break-after {
            page-break-after: always;
        }
        .avoid-break {
            page-break-inside: avoid;
        }
        .summary-section {
            width: 100%;
        }
        .summary-table {
            width: 250px;
            margin-left: auto;
            border-collapse: collapse;
            background-color: #f8fafc;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid var(--dominant-color);
        }
        .summary-table td {
            padding: 4px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9px;
        }
        .summary-table .total {
            font-size: 11px;
            font-weight: bold;
            color: var(--dominant-color);
            background-color: var(--dominant-color-light);
            border-bottom: none;
        }
        .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 7px;
            color: #6b7280;
            border-top: 1px solid var(--dominant-color);
            padding-top: 6px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .text-bold {
            font-weight: bold;
        }
        .currency {
            font-weight: bold;
            color: #14532d;
        }
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 6px;
            background-color: #f9fafb;
        }
    </style>
</head>
<body>
    <div class="header">
        <table class="header-table">
            <tr>
                <td class="company-section">
                    <div class="company-name">{{ $companyName ?? 'Şirket Adı' }}</div>
                    <div class="company-details">
                        <div>{{ $companyAddress ?? 'Şirket Adresi' }}</div>
                        <div> {{ $companyPhone ?? 'Telefon' }}</div>
                        <div> {{ $companyEmail ?? 'E-posta' }}</div>
                        <div style="margin-top: 6px; font-weight: bold; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 4px;">
                            <div style="font-size: 9px; color: #6b7280; margin-bottom: 2px;">Teklif No:</div>
                            <div style="font-size: 11px;">{{ $quoteNo ?? '' }}</div>
                        </div>
                    </div>
                </td>
                <td class="logo-section">
                    @if(isset($logoPath) && $logoPath)
                        <img src="{{ $logoPath }}" alt="Logo" class="company-logo">
                    @elseif(isset($logoPreview) && $logoPreview)
                        <img src="{{ $logoPreview }}" alt="Logo" class="company-logo">
                    @else
                        <!-- Logo yoksa boş bırak -->
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <div class="quote-header">
        <div class="quote-title">{{ $quoteTitle ?? 'Teklif' }}</div>

    </div>

    <div class="quote-info">
        <table class="info-table">
            <tr>
                <td class="info-left">
                    <div class="info-item">
                        <span class="info-label">Müşteri/Firma:</span>
                        <span class="info-value"> {{ $customerName ?? '' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Geçerlilik Tarihi:</span>
                        <span class="info-value"> {{ $validUntil ?? '' }}</span>
                    </div>
                </td>
                <td class="info-right">
                    <div class="info-item">
                        <span class="info-label">Hazırlayan:</span>
                        <span class="info-value"> {{ $preparedBy ?? '' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Teklif Tarihi:</span>
                        <span class="info-value"> {{ $quoteDate ?? '' }}</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="products-section">
        <div class="section-title"> Ürün Detayları</div>

        @php
            $products = $products ?? [];
            $productsPerPageFirst = 15;
            $productsPerPageOther = 26;
            $totalProducts = count($products);
            $pages = [];
            if ($totalProducts > 0) {
                // İlk sayfa
                $pages[] = array_slice($products, 0, $productsPerPageFirst);
                // Sonraki sayfalar
                $remaining = array_slice($products, $productsPerPageFirst);
                while (count($remaining) > 0) {
                    $pages[] = array_slice($remaining, 0, $productsPerPageOther);
                    $remaining = array_slice($remaining, $productsPerPageOther);
                }
            }
            $totalPages = count($pages);
        @endphp

        @foreach($pages as $pageIndex => $pageProducts)
            @if($pageIndex > 0)
                <div class="page-break"></div>
            @endif
            <table class="products-table">
                <thead>
                    <tr>
                        <th width="4%" class="text-center">#</th>
                        <th width="12%" class="text-center">Ürün Kodu</th>
                        <th width="28%">Ürün Adı</th>
                        <th width="10%" class="text-center">Miktar</th>
                        <th width="12%" class="text-right">Birim Fiyat</th>
                        <th width="10%" class="text-right">İndirim</th>
                        <th width="10%" class="text-center">KDV Oranı</th>
                        <th width="12%" class="text-right">Tutar (KDV Dahil)</th>
                    </tr>
                </thead>
                <tbody>

                    @php $startIndex = $pageIndex === 0 ? 0 : $productsPerPageFirst + ($pageIndex-1)*$productsPerPageOther; @endphp
                    @foreach($pageProducts as $i => $product)
                    <tr>
                        <td class="text-center">{{ $startIndex + $i + 1 }}</td>
                        <td class="text-center text-bold">{{ $product['code'] ?? '' }}</td>
                        <td>{{ $product['name'] ?? '' }}</td>
                        <td class="text-center">{{ $product['quantity'] ?? 1 }} {{ $product['unit'] ?? '' }}</td>
                        <td class="text-right currency">{{ number_format($product['unitPrice'] ?? 0, 2, ',', '.') }} TL</td>
                        <td class="text-right currency">-{{ number_format($product['discount'] ?? 0, 2, ',', '.') }} TL</td>
                        <td class="text-center">%{{ $product['taxRate'] ?? 20 }}</td>
                        <td class="text-right currency">{{ number_format(((($product['unitPrice'] ?? 0) * ($product['quantity'] ?? 1)) - ($product['discount'] ?? 0)) * (1 + ($product['taxRate'] ?? 20) / 100), 2, ',', '.') }} TL</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 6px; font-size: 8px; color: #6b7280;">
                Sayfa {{ $pageIndex + 1 }} / {{ $totalPages }}
            </div>
        @endforeach
    </div>

    <div class="summary-section">
        <table class="summary-table">
            <tr>
                <td>Ara Toplam:</td>
                <td class="text-right">{{ number_format(array_sum(array_map(fn($p) => ($p['unitPrice'] ?? 0) * ($p['quantity'] ?? 1), $products ?? [])), 2, ',', '.') }} TL</td>
            </tr>
            <tr>
                <td>Ürün İndirimleri:</td>
                <td class="text-right">-{{ number_format(array_sum(array_map(fn($p) => $p['discount'] ?? 0, $products ?? [])), 2, ',', '.') }} TL</td>
            </tr>
            <tr>
                <td>KDV (Ürün Bazında):</td>
                <td class="text-right">{{ number_format(array_sum(array_map(fn($p) => ((($p['unitPrice'] ?? 0) * ($p['quantity'] ?? 1)) - ($p['discount'] ?? 0)) * (($p['taxRate'] ?? 20) / 100), $products ?? [])), 2, ',', '.') }} TL</td>
            </tr>
            <tr>
                <td>Genel İndirim:</td>
                <td class="text-right">-{{ number_format($discount ?? 0, 2, ',', '.') }} TL</td>
            </tr>
            <tr>
                <td class="total"> Genel Toplam:</td>
                <td class="total text-right">
                    @php
                        $totalProductPrice = array_sum(array_map(fn($p) => ((($p['unitPrice'] ?? 0) * ($p['quantity'] ?? 1)) - ($p['discount'] ?? 0)) * (1 + ($p['taxRate'] ?? 20) / 100), $products ?? []));
                        $grandTotal = $totalProductPrice - ($discount ?? 0);
                    @endphp
                    {{ number_format($grandTotal, 2, ',', '.') }} TL
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <div style="margin-bottom: 2px;">
            <strong>{{ $companyName ?? '' }}</strong> | {{ $companyPhone ?? '' }} | {{ $companyEmail ?? '' }}
        </div>
        <div style="font-size: 6px; color: #9ca3af;">
            © 2025 EasyTradeTR | Bu belge, EasyTradeTR Bulut Tabanlı Barkodlu Satış Sistemi  tarafından oluşturulmuştur.  https://easytradetr.com/
        </div>
        <div style="margin-top: 3px;">
            <img src="{{ public_path('logo.png') }}" alt="logo" style="height: 10px;">
        </div>
    </div>
</body>
</html>
