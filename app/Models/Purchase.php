<?php

namespace App\Models;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'supplier_id',
    'user_id',
    'invoice_number',
    'total_price',
])]
class Purchase extends Model
{
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'purchase_details'
        )->withPivot('quantity', 'price', 'subtotal');
    }

    public function scopeFilter(Builder $query, array $filter)
    {
        return $query->when($filter['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        })
        ->when($filter['date'] ?? null, function ($query, $date) {
            $query->whereDate('created_at', $date);
        })
        ->when($filter['userId'] ?? null, function ($query, $userId) {
            $query->where('user_id', $userId);
        });
    }
}
