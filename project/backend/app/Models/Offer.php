<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'offer_number', 'customer_name', 'company_name', 'theme_color', 'discount', 'vat', 'total'
    ];

    public function items()
    {
        return $this->hasMany(OfferItem::class);
    }
}
