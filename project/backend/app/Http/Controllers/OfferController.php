<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    private function generateOfferNumber()
    {
        $date = now()->format('Ymd');
        $countToday = Offer::whereDate('created_at', now()->toDateString())->count() + 1;
        return sprintf('TKLF-%s-%03d', $date, $countToday);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string',
            'company_name' => 'required|string',
            'theme_color' => 'nullable|string',
            'discount' => 'nullable|numeric',
            'vat' => 'nullable|numeric',
            'total' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_code' => 'nullable|string',
            'items.*.unit' => 'nullable|string',
            'items.*.quantity' => 'required|integer',
            'items.*.unit_price' => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.vat' => 'nullable|numeric',
            'items.*.total' => 'nullable|numeric',
        ]);

        $offer = Offer::create([
            'offer_number' => $this->generateOfferNumber(),
            'customer_name' => $data['customer_name'],
            'company_name' => $data['company_name'],
            'theme_color' => $data['theme_color'] ?? null,
            'discount' => $data['discount'] ?? 0,
            'vat' => $data['vat'] ?? 20,
            'total' => $data['total'] ?? 0,
        ]);

        foreach ($data['items'] as $item) {
            $offer->items()->create($item);
        }

        return response()->json($offer->load('items'), 201);
    }

    public function index()
    {
        return Offer::with('items')->orderByDesc('created_at')->get();
    }

    public function show($id)
    {
        return Offer::with('items')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $offer = Offer::findOrFail($id);
        $data = $request->validate([
            'customer_name' => 'required|string',
            'company_name' => 'required|string',
            'theme_color' => 'nullable|string',
            'discount' => 'nullable|numeric',
            'vat' => 'nullable|numeric',
            'total' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_code' => 'nullable|string',
            'items.*.unit' => 'nullable|string',
            'items.*.quantity' => 'required|integer',
            'items.*.unit_price' => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.vat' => 'nullable|numeric',
            'items.*.total' => 'nullable|numeric',
        ]);
        $offer->update($data);
        $offer->items()->delete();
        foreach ($data['items'] as $item) {
            $offer->items()->create($item);
        }
        return response()->json($offer->load('items'));
    }
}
