<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    public function getKpiSummary(Carbon $startDate, Carbon $endDate): array
    {
        $salesAggregate = DB::table('sales')
            ->whereBetween('created_at', [$startDate->copy()->startOfDay(), $endDate->copy()->endOfDay()])
            ->selectRaw('COALESCE(SUM(total_price), 0) as total_revenue, COUNT(*) as total_sales_transactions')
            ->first();

        $purchaseAggregate = DB::table('purchases')
            ->whereBetween('created_at', [$startDate->copy()->startOfDay(), $endDate->copy()->endOfDay()])
            ->selectRaw('COALESCE(SUM(total_price), 0) as total_expense')
            ->first();

        return [
            'total_revenue' => (float) ($salesAggregate->total_revenue ?? 0),
            'total_expense' => (float) ($purchaseAggregate->total_expense ?? 0),
            'total_sales_transactions' => (int) ($salesAggregate->total_sales_transactions ?? 0),
        ];
    }

    public function getDailySalesTrend(Carbon $startDate, Carbon $endDate): Collection
    {
        return DB::table('sales')
            ->whereBetween('created_at', [$startDate->copy()->startOfDay(), $endDate->copy()->endOfDay()])
            ->selectRaw('DATE(created_at) as sale_date, COALESCE(SUM(total_price), 0) as total_sales')
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get();
    }

    public function getTopSellingProducts(Carbon $startDate, Carbon $endDate, int $limit = 5): Collection
    {
        return DB::table('sale_details')
            ->join('sales', 'sales.id', '=', 'sale_details.sale_id')
            ->join('products', 'products.id', '=', 'sale_details.product_id')
            ->whereBetween('sales.created_at', [$startDate->copy()->startOfDay(), $endDate->copy()->endOfDay()])
            ->selectRaw('products.id, products.name, products.sku, COALESCE(SUM(sale_details.quantity), 0) as total_quantity_sold, COALESCE(SUM(sale_details.subtotal), 0) as total_sales_amount')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_quantity_sold')
            ->orderByDesc('total_sales_amount')
            ->limit($limit)
            ->get();
    }

    public function getLowStockProducts(int $threshold = 10): Collection
    {
        return DB::table('products')
            ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
            ->where('products.stock', '<=', $threshold)
            ->select('products.id', 'products.name', 'products.sku', 'products.stock', 'products.price_sell', 'categories.name as category_name')
            ->orderBy('products.stock')
            ->orderBy('products.name')
            ->get();
    }
}
