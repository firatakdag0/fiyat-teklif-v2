<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfferItem extends Model
{
    protected $fillable = [
        'offer_id', 'product_id', 'product_name', 'product_code', 'unit', 'quantity', 'unit_price', 'discount', 'vat', 'total'
    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}
