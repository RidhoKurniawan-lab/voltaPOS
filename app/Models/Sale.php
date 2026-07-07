<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_id',
    'invoice_number',
    'total_price',
    'money_received',
    'money_change',
])]
class Sale extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'sale_details'
        )->withPivot('quantity', 'price', 'subtotal');
    }

    public function scopeFilter(Builder $query, array $filter)
    {
        return $query->when($filter['search'] ?? null, function ($query, $search) {
            $query->where('invoice_number', 'like', "%{$search}%");
        })
        ->when($filter['date'] ?? null, function ($query, $date) {
            $query->whereDate('created_at', $date);
        })
        ->when($filter['userId'] ?? null, function ($query, $userId) {
            $query->where('user_id', $userId);
        });
    }
}
