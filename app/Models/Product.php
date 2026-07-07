<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable([
    'category_id',
    'name',
    'sku',
    'price_buy',
    'price_sell',
    'stock',
    'description'
])]
class Product extends Model
{
    use HasFactory;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeFilter(Builder $query, array $filter)
    {
        return $query
            ->when($filter['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($filter['category'] ?? null, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when($filter['minStock'] ?? null, function ($query, $minStock) {
                $query->where('stock', '<=', $minStock);
            });
    }

    protected static function booted()
    {
        static::creating(function ($product) {
            $product->sku = 'PRD-'.substr(Str::ulid()->toBase32(), 18);
        });
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class);
    }

    public function sales()
    {
        return $this->belongsToMany(
            Sale::class,
            'sale_details'
        )->withPivot('quantity', 'price', 'subtotal');
    }

    public function purchases()
    {
        return $this->belongsToMany(
            Purchase::class,
            'purchase_details'
        )->withPivot('quantity', 'price', 'subtotal');
    }
}
